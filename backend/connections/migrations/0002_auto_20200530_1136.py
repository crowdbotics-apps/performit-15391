# Generated by Django 2.2.12 on 2020-05-30 11:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('connections', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserRelationship',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('follower', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_follower_set', to=settings.AUTH_USER_MODEL)),
                ('following', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_following_user_set', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'User Relationship Management',
                'verbose_name_plural': 'User Relationship Management',
            },
        ),
        migrations.RemoveField(
            model_name='userfollowing',
            name='following',
        ),
        migrations.RemoveField(
            model_name='userfollowing',
            name='user',
        ),
        migrations.DeleteModel(
            name='UserFollower',
        ),
        migrations.DeleteModel(
            name='UserFollowing',
        ),
    ]
