from django.contrib import admin
from django.urls import path, include, re_path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.static import serve

handler500 = 'proj.views.handler500'
# handler404 = 'proj.views.handler404'
# handler403 = 'proj.views.handler404'
# handler400 = 'proj.views.handler404'

urlpatterns = [
    path('', views.index, name='index'),
    path('fiscal/', views.fiscal, name = 'fiscal'),
    #path('fiscal/overview', views.fiscal_overview, name = 'overview'),
    path('fiscal/posts', views.fiscal_posts, name = 'posts'),
    path('fiscal/posts/getposts', views.get_posts, name= 'getposts'), 
    re_path(r'^fiscal/q-expd-(?P<startDate>\d+)/' + r'(?P<endDate>\d+)', views.gov_expend_plus, name= 'govexpend'),
    re_path(r'^fiscal/q-(?P<startDate>\d+)/' + r'(?P<endDate>\d+)', views.fiscalquery, name='fiscalquery'),
    re_path(r'^fiscal/q-idx-(?P<startDate>\d+)/' + r'(?P<endDate>\d+)', views.price_index, name= 'price_index'),
    re_path(r'^fiscal/q-outlays-(?P<year>\d+)', views.update_outlays, name= 'outlays'),
    path('projects/', views.projects, name= 'projects'),
    path('test/', views.test, name= 'test'),
    re_path(r'^.*/$', views.handler500),
]
