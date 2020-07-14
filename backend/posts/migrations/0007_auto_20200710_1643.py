# Generated by Django 2.2.13 on 2020-07-10 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0006_auto_20200618_0946'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to='posts/', verbose_name='SELECT Thumbnail'),
        ),
        migrations.AlterField(
            model_name='postrank',
            name='average_rank',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True, verbose_name='Enter Average Rank'),
        ),
    ]