"""
Definition of views.
"""

from datetime import datetime
from django.shortcuts import render, get_object_or_404
from django.http import HttpRequest
from .models import Ichimliklar, Kompaniya


def home(request):
    """Renders the home page."""
    ichimliklar = Ichimliklar.objects.select_related('kompaniya').all()
    ichimlik = Ichimliklar.objects.all()[:5]
    chegirmalar = Ichimliklar.objects.filter(chegirma=True)
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/index.html',
        {
            'title': 'Home Page',
            'year': datetime.now().year,
            'ichimliklar': ichimliklar,
            'chegirmalar': chegirmalar,
            'ichimlik': ichimlik,
        }
    )


def kompaniya(request, slug):
    """Renders the company page."""
    assert isinstance(request, HttpRequest)
    kompaniya = get_object_or_404(Kompaniya, slug=slug)
    return render(
        request,
        'app/kompaniya.html',
        {
            'title': 'Kompaniya Haqida',
            'year': datetime.now().year,
            'k': kompaniya,
        }
    )