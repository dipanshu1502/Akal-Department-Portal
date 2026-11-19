<?php

namespace Database\Seeders;

use App\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'university_name', 'value' => 'Akal University', 'group' => 'general', 'description' => 'Official University Name'],
            ['key' => 'university_tagline', 'value' => 'Pursuing Excellence in Higher Education & Moral Values', 'group' => 'general', 'description' => 'Institution Tagline'],
            ['key' => 'university_location', 'value' => 'Talwandi Sabo, Bathinda, Punjab, India - 151302', 'group' => 'contact', 'description' => 'Campus Address'],
            ['key' => 'official_email', 'value' => 'info@auts.ac.in', 'group' => 'contact', 'description' => 'General Inquiries Email'],
            ['key' => 'admissions_email', 'value' => 'admission@auts.ac.in', 'group' => 'contact', 'description' => 'Admissions Helpline Email'],
            ['key' => 'contact_phone', 'value' => '1800-2020-100', 'group' => 'contact', 'description' => 'Toll-free 24x7 Helpline'],
            ['key' => 'official_website_url', 'value' => 'https://auts.ac.in/', 'group' => 'general', 'description' => 'Main University URL'],
            ['key' => 'portal_title', 'value' => 'Akal University – Dynamic Department Management Portal', 'group' => 'portal', 'description' => 'CMS Portal Display Title'],
            ['key' => 'approval_workflow_enabled', 'value' => '1', 'group' => 'workflow', 'description' => 'Enforce Super Admin Approval for Content Changes'],
        ];

        foreach ($settings as $setting) {
            SystemSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
