# Generated by Django 2.2.12 on 2020-05-28 14:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20200508_1126'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_type', models.CharField(choices=[('Artist', 'Artist'), ('Singer', 'Singer'), ('Rapper', 'Rapper'), ('Dancer', 'Dancer'), ('Producer', 'Producer'), ('Other', 'Other')], max_length=15, verbose_name='Select User Type')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_type_user_set', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'User Type Management',
                'verbose_name_plural': 'User Type Management',
            },
        ),
        migrations.CreateModel(
            name='UserDetail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_pic', models.ImageField(null=True, upload_to='profile_images', verbose_name='Select Image')),
                ('location_address', models.TextField(verbose_name='Enter User Address')),
                ('location_lat', models.CharField(blank=True, max_length=255, null=True, verbose_name='Enter Location Latitude')),
                ('location_long', models.CharField(blank=True, max_length=255, null=True, verbose_name='Enter Location Longitude')),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female')], max_length=10, verbose_name='Select Gender')),
                ('bio', models.TextField(blank=True, null=True, verbose_name='Enter Bio')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user_detail_user_set', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'User Detail Management',
                'verbose_name_plural': 'User Detail Management',
            },
        ),
        migrations.CreateModel(
            name='ConnectedSocialMedia',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('social_media_type', models.CharField(choices=[('Facebook', 'Facebook'), ('Instagram', 'Instagram'), ('Youtube', 'Youtube')], max_length=20, verbose_name='Select Social Media Type')),
                ('link', models.CharField(blank=True, max_length=1024, null=True, verbose_name='Social Media Link')),
                ('social_media_user_id', models.CharField(blank=True, max_length=1024, null=True, verbose_name='Social Media User ID')),
                ('user_token', models.CharField(blank=True, max_length=2048, null=True, verbose_name='Social Media Token')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='connected_social_media_user_set', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Connected Social Media Management',
                'verbose_name_plural': 'Connected Social Media Management',
            },
        ),
    ]
