# Generated by Django 3.1 on 2020-12-02 16:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Barter', '0008_auto_20201127_1944'),
    ]

    operations = [
        migrations.CreateModel(
            name='Offer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='images/')),
                ('title', models.TextField()),
                ('text', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('barter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='barter_offers', to='Barter.post')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_offers', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]