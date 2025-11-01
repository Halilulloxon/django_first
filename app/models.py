from django.db import models
from django.utils.text import slugify


from django.utils.text import slugify

class Kompaniya(models.Model):
    nomi = models.CharField(max_length=200)
    mamlakat = models.CharField(max_length=100, null=True)
    tavsif = models.TextField(blank=True, null=True)
    telefon = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    logo = models.ImageField(upload_to='kompaniyalar/', blank=True, null=True)
    slug = models.SlugField(unique=True, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug and self.nomi:
            base_slug = slugify(self.nomi)
            slug = base_slug
            counter = 1
            while Kompaniya.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nomi


class Ichimliklar(models.Model):
    nomi = models.CharField(max_length=50)
    narxi = models.DecimalField(max_digits=10, decimal_places=2)
    miqdori = models.PositiveIntegerField()
    chegirma = models.BooleanField(default=False)
    chegirma_miqdori = models.PositiveSmallIntegerField(default=0)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    kompaniya = models.ForeignKey(
        Kompaniya,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ichimliklar'
    )

    def __str__(self):
        return f"{self.nomi} - {self.narxi} so'm"