from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Inquiry


@receiver(post_save, sender=Inquiry)
def notify_admin_of_inquiry(sender, instance, created, **kwargs):
    if created:
        subject = f"New Luxury Inquiry: {instance.property.title if instance.property else 'General'}"
        message = f"Inquiry from {instance.full_name} ({instance.email}).\n\nMessage: {instance.message}"

        send_mail(
            subject,
            message,
            'sirodaniel48@gmail.com',
            ['stewartdan41@gmail.com'],
            fail_silently=False,
        )
