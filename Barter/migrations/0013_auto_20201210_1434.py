# Generated by Django 3.1 on 2020-12-10 20:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Barter', '0012_post_active'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='reciver',
            new_name='receiver',
        ),
    ]