# Generated by Django 3.1 on 2020-11-26 20:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Barter', '0003_auto_20201126_1242'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='Winner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='user_won_posts', to=settings.AUTH_USER_MODEL),
        ),
    ]
