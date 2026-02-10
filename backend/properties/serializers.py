from rest_framework import serializers
from .models import Property, PropertyImage, Location, Inquiry, Agent

class AgentPortfolioSerializer(serializers.ModelSerializer):
    # We use a simpler version of PropertySerializer here to avoid infinite loops
    properties = serializers.SerializerMethodField()

    class Meta:
        model = Agent
        fields = ['id', 'name', 'image', 'properties']

    def get_properties(self, obj):
        # Fetching titles and slugs for the agent's current listings
        return obj.properties.values('title', 'slug', 'price')


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['name', 'city', 'slug']


class PropertyImageSerializer(serializers.ModelSerializer):
    """
    Serializer for individual property images.
    Extracts the Cloudinary public ID for use with CldImage on the frontend.
    """
    cloudinary_id = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ['id', 'cloudinary_id', 'is_cover', 'order', 'alt_text']

    def get_cloudinary_id(self, obj):
        # 1. Access the image_url field safely
        image_field = getattr(obj, 'image_url', None)
        if hasattr(image_field, 'public_id'):
            return image_field.public_id

        # If it's a string, we need to make sure it's NOT a full URL
        if isinstance(image_field, str):
        # If it contains 'http', it's a full URL and we must extract the ID
            if 'http' in image_field:
                return image_field.split('/')[-1].split('.')[0]
        return image_field

        return "placeholders/property_main"

class AgentPropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ['id', 'title', 'slug']

class AgentSerializer(serializers.ModelSerializer):
    properties = AgentPropertySerializer(many=True, read_only=True)

    class Meta:
        model = Agent
        fields = ['id', 'name', 'role', 'email', 'phone', 'image', 'bio', 'whatsapp_number', 'properties']

class PropertySerializer(serializers.ModelSerializer):
    """
    Main Property Serializer.
    Includes nested location data and gallery images.
    """
    location = LocationSerializer(read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)
    cloudinary_id = serializers.SerializerMethodField()
    agent = AgentSerializer(read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'slug', 'price', 'location', 'cloudinary_id',
            'bedrooms', 'bathrooms', 'sq_ft', 'status', 
            'is_featured', 'images', 'created_at', 'description', 'agent'
        ]
        lookup_field = 'slug'

    def get_cloudinary_id(self, obj):
        # 1. Attempt to use a dedicated 'main_image' field if it exists
        main_img = getattr(obj, 'main_image', None)
        if main_img:
            if isinstance(main_img, str):
                return main_img
            return getattr(main_img, 'name', str(main_img))

        # 2. Fallback: Use the first image from the gallery marked as 'is_cover'
        cover_image = obj.images.filter(is_cover=True).first()
        if cover_image:
            image_field = getattr(cover_image, 'image_url', None)
            if image_field:
                if isinstance(image_field, str):
                    return image_field
                return getattr(image_field, 'name', str(image_field))
            
        return "placeholders/property_main"

class InquirySerializer(serializers.ModelSerializer):
    property = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(), 
        required=False, 
        allow_null=True
    )

    class Meta:
        model = Inquiry
        fields = ['id', 'property', 'full_name', 'email', 'message', 'created_at']