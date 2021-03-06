# Generated by Django 2.2.16 on 2020-09-24 11:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0003_inviteuser'),
        ('notifications', '0003_auto_20200915_1226'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='invite',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notification_invite_set', to='groups.InviteUser'),
        ),
        migrations.AddField(
            model_name='notification',
            name='request',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notification_request_set', to='groups.JoiningRequest'),
        ),
    ]
