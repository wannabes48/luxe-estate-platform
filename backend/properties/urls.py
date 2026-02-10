from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, InquiryViewSet, AdminPropertyViewSet, AdminInquiryViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .import views

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'inquiries', InquiryViewSet, basename='inquiry')
router.register(r'admin/properties', AdminPropertyViewSet, basename='admin-property')
router.register(r'admin/inquiries', AdminInquiryViewSet, basename='admin-inquiry')

urlpatterns = [
    path('', include(router.urls)),
    # Auth
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('properties/<slug:slug>/', views.PropertyDetailView.as_view()),
    path('properties/<uuid:property_id>/similar/', views.SimilarPropertiesView.as_view()),
]
