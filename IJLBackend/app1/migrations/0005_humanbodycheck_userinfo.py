# Generated by Django 5.1 on 2025-07-18 04:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0004_multiskilling_end_date_multiskilling_reason_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='HumanBodyCheck',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('temp_id', models.CharField(max_length=50)),
                ('check_date', models.DateTimeField(auto_now_add=True)),
                ('overall_status', models.CharField(choices=[('pass', 'Pass'), ('fail', 'Fail'), ('pending', 'Pending')], default='pending', max_length=10)),
                ('color_vision', models.CharField(choices=[('pass', 'Pass'), ('fail', 'Fail'), ('pending', 'Pending')], default='pending', max_length=10)),
                ('eye_movement', models.CharField(choices=[('pass', 'Pass'), ('fail', 'Fail'), ('pending', 'Pending')], default='pending', max_length=10)),
                ('fingers_functionality', models.CharField(choices=[('pass', 'Pass'), ('fail', 'Fail'), ('pending', 'Pending')], default='pending', max_length=10)),
                ('hand_deformity', models.CharField(choices=[('pass', 'Pass'), ('fail', 'Fail'), ('pending', 'Pending')], default='pending', max_length=10)),
                ('joint_mobility', models.CharField(choices=[('pass', 'Pass'), ('fail', 'Fail'), ('pending', 'Pending')], default='pending', max_length=10)),
                ('hearing', models.CharField(choices=[('pass', 'Pass'), ('fail', 'Fail'), ('pending', 'Pending')], default='pending', max_length=10)),
                ('bending_ability', models.CharField(choices=[('pass', 'Pass'), ('fail', 'Fail'), ('pending', 'Pending')], default='pending', max_length=10)),
                ('additional_checks', models.JSONField(blank=True, default=list)),
                ('notes', models.TextField(blank=True)),
            ],
            options={
                'verbose_name': 'Human Body Check',
                'verbose_name_plural': 'Human Body Checks',
                'ordering': ['-check_date'],
            },
        ),
        migrations.CreateModel(
            name='UserInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(blank=True, help_text="User's first name", max_length=50, null=True)),
                ('last_name', models.CharField(blank=True, help_text="User's last name", max_length=50, null=True)),
                ('temp_id', models.CharField(editable=False, help_text='Auto-generated temporary ID for the user', max_length=50, unique=True)),
                ('email', models.EmailField(blank=True, help_text="User's email address (optional)", max_length=254, null=True, unique=True)),
                ('phone_number', models.CharField(help_text="User's phone number (required)", max_length=17)),
                ('sex', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], default='M', help_text="User's sex", max_length=1)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'User Information',
                'verbose_name_plural': 'User Information',
                'ordering': ['-created_at'],
            },
        ),
    ]
