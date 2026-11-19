<?php

namespace Database\Seeders;

use App\SectionType;
use Illuminate\Database\Seeder;

class SectionTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'key' => 'text',
                'name' => 'Text Content',
                'description' => 'Heading, subheading and rich text for department overview, mission and descriptions.',
                'icon' => 'FileText',
                'schema' => [
                    'fields' => [
                        ['name' => 'body', 'type' => 'textarea', 'label' => 'Content Body', 'required' => true],
                    ],
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'key' => 'image_text',
                'name' => 'Image + Text',
                'description' => 'Image on one side (left or right) and structured narrative on the other.',
                'icon' => 'Image',
                'schema' => [
                    'fields' => [
                        ['name' => 'body', 'type' => 'textarea', 'label' => 'Description', 'required' => true],
                        ['name' => 'image', 'type' => 'text', 'label' => 'Image URL', 'required' => true],
                        ['name' => 'image_position', 'type' => 'select', 'label' => 'Image Position', 'options' => ['left', 'right'], 'default' => 'right'],
                    ],
                ],
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'key' => 'card_grid',
                'name' => 'Card Grid',
                'description' => 'Responsive cards with titles, icons/images, descriptions and optional links.',
                'icon' => 'LayoutGrid',
                'schema' => [
                    'columns' => 3,
                    'item_fields' => ['title', 'description', 'image', 'link'],
                ],
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'key' => 'timeline',
                'name' => 'Timeline',
                'description' => 'Chronological milestones, department history, achievements or key dates.',
                'icon' => 'Clock',
                'schema' => [
                    'item_fields' => ['date', 'title', 'description'],
                ],
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'key' => 'banner',
                'name' => 'Banner / Highlight',
                'description' => 'Full-width visual callout with headline, text and primary call-to-action.',
                'icon' => 'Flag',
                'schema' => [
                    'fields' => [
                        ['name' => 'body', 'type' => 'textarea', 'label' => 'Banner Message', 'required' => true],
                        ['name' => 'cta_label', 'type' => 'text', 'label' => 'Button Label'],
                        ['name' => 'cta_link', 'type' => 'text', 'label' => 'Button Link'],
                    ],
                ],
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'key' => 'statistics',
                'name' => 'Statistics',
                'description' => 'Key numerical metrics such as students placed, research papers, labs and grants.',
                'icon' => 'BarChart2',
                'schema' => [
                    'item_fields' => ['value', 'label', 'icon'],
                ],
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'key' => 'gallery',
                'name' => 'Photo Gallery',
                'description' => 'Grid of photos with captions and modal lightbox viewing.',
                'icon' => 'Camera',
                'schema' => [
                    'item_fields' => ['image', 'title', 'caption'],
                ],
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'key' => 'accordion',
                'name' => 'Accordion / FAQ',
                'description' => 'Expandable question and answer pairs or grouped collapsible content.',
                'icon' => 'HelpCircle',
                'schema' => [
                    'item_fields' => ['question', 'answer'],
                ],
                'is_active' => true,
                'sort_order' => 8,
            ],
        ];

        foreach ($types as $type) {
            SectionType::updateOrCreate(['key' => $type['key']], $type);
        }
    }
}
