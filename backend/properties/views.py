from rest_framework import viewsets, permissions, filters, status, generics
from rest_framework.decorators import action, permission_classes, authentication_classes
from rest_framework.throttling import AnonRateThrottle
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from django.core.files.storage import default_storage
import uuid

from .models import Property, Inquiry, PropertyImage, Agent
from .models import AuditLog
from django.db import transaction
from .serializers import PropertySerializer, InquirySerializer, AgentSerializer
from .permissions import AdminOnly, IsAdminOrReadOnly

class AgentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [AllowAny]

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer
    lookup_field = 'slug'

    # Filtering & Pagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['status', 'location__slug', 'bedrooms']
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'similar']: # Added 'similar' here
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = Property.objects.all()
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__city__icontains=location)
        return queryset

    # --- MOVE THE SIMILAR METHOD HERE ---
    @action(detail=True, methods=['get'])
    def similar(self, request, slug=None): # Use slug if that's your lookup_field
        property_obj = self.get_object()
        
        # Define price range
        min_price = float(property_obj.price) * 0.8
        max_price = float(property_obj.price) * 1.2

        similar_properties = Property.objects.filter(
            Q(location__city=property_obj.location.city) | 
            Q(price__range=(min_price, max_price))
        ).exclude(id=property_obj.id).distinct()[:3]

        serializer = PropertySerializer(similar_properties, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[AllowAny], authentication_classes=[])
    def next(self, request, slug=None):
        current_property = self.get_object()
        # Find the next property created after this one
        next_obj = Property.objects.filter(id__gt=current_property.id).order_by('id').first()

        # If no "next" exists, wrap around to the very first one
        if not next_obj:
            next_obj = Property.objects.order_by('id').first()

        serializer = self.get_serializer(next_obj)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[AllowAny], authentication_classes=[])
    def previous(self, request, slug=None):
        current_property = self.get_object()
        prev_obj = Property.objects.filter(id__lt=current_property.id).order_by('-id').first()
        
        if not prev_obj:
            # Loop to the last property if at the beginning
            prev_obj = Property.objects.order_by('-id').first()
            
        serializer = self.get_serializer(prev_obj)
        return Response(serializer.data)


class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    throttle_classes = [AnonRateThrottle]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def create(self, request, *args, **kwargs):
        # Invisible honeypot check: ignore silently if filled
        honeypot = request.data.get('hp_field') or request.data.get('honeypot')
        if honeypot:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return super().create(request, *args, **kwargs)


class AdminPropertyViewSet(viewsets.ModelViewSet):
    """Admin-only viewset to allow creating/editing properties with multiple image uploads."""
    queryset = Property.objects.all().prefetch_related('images')
    serializer_class = PropertySerializer
    permission_classes = [AdminOnly]
    lookup_field = 'slug'

    def create(self, request, *args, **kwargs):
        images_data = request.FILES.getlist('images')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            property_obj = serializer.save()
            saved_urls = []
            for image in images_data:
                # save to default storage and record accessible URL
                filename = f"properties/{uuid.uuid4().hex}_{image.name}"
                path = default_storage.save(filename, image)
                url = default_storage.url(path)
                PropertyImage.objects.create(property=property_obj, image_url=url)
                saved_urls.append(url)

            # audit log
            try:
                AuditLog.objects.create(
                    user=request.user if request.user and request.user.is_authenticated else None,
                    property=property_obj,
                    action='create_property',
                    notes=f'Created property with {len(saved_urls)} images. URLs: {saved_urls}'
                )
            except Exception:
                # don't fail creation if audit logging has issues
                pass

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminInquiryViewSet(viewsets.ModelViewSet):
    """Inquiries are managed by admins; allow marking as processed."""
    queryset = Inquiry.objects.all().order_by('-created_at')
    serializer_class = InquirySerializer
    permission_classes = [AdminOnly]

    def partial_update(self, request, pk=None):
        inquiry = self.get_object()
        inquiry.is_processed = request.data.get('is_processed', inquiry.is_processed)
        inquiry.save()
        return Response({'status': 'inquiry updated'})

class PropertyDetailView(generics.RetrieveAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    lookup_field = 'slug' 

class NextPropertyView(generics.RetrieveAPIView):
    permission_classes = [AllowAny] # This fixes the 403 Forbidden
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

class SimilarPropertiesView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [AllowAny] # This prevents the 403 Forbidden error

    def get_queryset(self):
        property_id = self.kwargs['property_id']
        try:
            current_property = Property.objects.get(id=property_id)
            # Find properties in the same location, excluding the current one
            return Property.objects.filter(
                location=current_property.location
            ).exclude(id=property_id)[:3] # Limit to 3 similar items
        except Property.DoesNotExist:
            return Property.objects.none()

class PropertyNavigation(generics.GenericAPIView):
    permission_classes = [AllowAny]
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    lookup_field = 'slug'

    def get(self, request, slug=None):
        instance = self.get_object()
        next_prop = Property.objects.filter(created_at__gt=instance.created_at).order_by('created_at').first()
        prev_prop = Property.objects.filter(created_at__lt=instance.created_at).order_by('-created_at').first()

        return Response({
            'next_slug': next_prop.slug if next_prop else None,
            'prev_slug': prev_prop.slug if prev_prop else None
        })

