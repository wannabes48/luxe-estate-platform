from django.contrib import admin
from .models import Location, Property, PropertyImage, Inquiry, Agent
from import_export.admin import ExportActionMixin


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 3
    fields = ('image_url', 'caption', 'is_cover', 'order')


@admin.register(Property)
class PropertyAdmin(ExportActionMixin, admin.ModelAdmin):
    list_display = ('title', 'location', 'price', 'status', 'is_featured', 'created_at')
    list_filter = ('status', 'is_featured', 'location')
    search_fields = ('title', 'description', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [PropertyImageInline]


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('id', 'display_property', 'email', 'created_at')
    list_filter = ('property', 'created_at')
    search_fields = ('email', 'message')
   
    def display_property(self, obj):
        return obj.property.title if obj.property else "General Inquiry"
    
    display_property.short_description = 'Property'

admin.site.register(Agent)

