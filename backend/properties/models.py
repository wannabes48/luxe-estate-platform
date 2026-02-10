import uuid
from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User

class Agent(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, default="Principal Partner")
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    image = models.URLField(max_length=500, blank=True, null=True)
    bio = models.TextField(blank=True)
    whatsapp_number = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.name


class TimeStampedModel(models.Model):
    """Abstract base class for tracking creation/updates."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Location(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)  # e.g., "Old Runda"
    city = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}, {self.city}"


class Property(TimeStampedModel):
    STATUS_CHOICES = [
        ("FOR_SALE", "For Sale"),
        ("RENTAL", "Rental"),
        ("SOLD", "Sold"),
    ]

    agent = models.ForeignKey(
        Agent, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='properties' # This allows agent.properties.all()
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(unique=True, max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(0)], db_index=True)

    # Specs
    bedrooms = models.PositiveIntegerField()
    bathrooms = models.PositiveIntegerField()
    sq_ft = models.DecimalField(max_digits=10, decimal_places=2)

    # Relationships
    location = models.ForeignKey(Location, on_delete=models.PROTECT, related_name='properties')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='FOR_SALE')
    is_featured = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Properties"
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField()  # Direct link from Cloudinary/S3
    caption = models.CharField(max_length=200, blank=True)
    is_cover = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='property_gallery/')
    alt_text = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.property.title} ({self.id})"


class Inquiry(TimeStampedModel):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, null=True, blank=True, related_name='inquiries')
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        if self.property:
            return f"Inquiry for {self.property.title} by {self.full_name}"
        
        # Fallback for general inquiries from the contact page
        return f"General Inquiry by {self.full_name}"

class AuditLog(models.Model):
    action = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(default="No details provided")

    def __str__(self):
        return f"{self.user} - {self.action} at {self.timestamp}"