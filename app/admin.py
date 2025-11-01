from django.contrib import admin
from .models import Ichimliklar
from .models import Kompaniya
class IchimliklarAdmin(admin.ModelAdmin):
    list_display = ('id', 'nomi', 'narxi', 'image')
    search_fields = ('nomi',)
    list_filter = ('narxi',)
from django.contrib import admin
from .models import Kompaniya

@admin.register(Kompaniya)
class KompaniyaAdmin(admin.ModelAdmin):
    list_display = ('nomi', 'mamlakat', 'telefon', 'email', 'slug')
    prepopulated_fields = {'slug': ('nomi',)}

admin.site.register(Ichimliklar, IchimliklarAdmin)
 
