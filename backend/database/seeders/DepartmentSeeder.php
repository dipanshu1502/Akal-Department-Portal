<?php

namespace Database\Seeders;

use App\Achievement;
use App\ActivityLog;
use App\ContentRevision;
use App\Department;
use App\DepartmentSection;
use App\DepartmentSetting;
use App\Event;
use App\Faculty;
use App\FacultyMember;
use App\Gallery;
use App\Laboratory;
use App\Notice;
use App\Programme;
use App\Publication;
use App\User;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Faculties
        $facultiesData = [
            [
                'name' => 'Faculty of Engineering and Technology',
                'slug' => 'engineering-technology',
                'description' => 'Cutting-edge technology programmes, computer systems, and innovative engineering applications.',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Faculty of Sciences',
                'slug' => 'sciences',
                'description' => 'Fundamental and applied scientific education fostering discovery and scientific temperament.',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Faculty of Commerce and Management',
                'slug' => 'commerce-management',
                'description' => 'Rigorous business administration, accounting, entrepreneurship, and financial leadership.',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Faculty of Humanities and Social Sciences',
                'slug' => 'humanities-social-sciences',
                'description' => 'Cultural insight, languages, literature, psychology, and multidisciplinary social sciences.',
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        $faculties = [];
        foreach ($facultiesData as $fData) {
            $faculties[$fData['slug']] = Faculty::updateOrCreate(['slug' => $fData['slug']], $fData);
        }

        // 2. Department Definitions
        $deptCse = Department::updateOrCreate(
            ['slug' => 'computer-science-engineering'],
            [
                'faculty_id' => $faculties['engineering-technology']->id,
                'name' => 'Computer Science & Engineering',
                'code' => 'CSE',
                'short_description' => 'Empowering future tech leaders in Artificial Intelligence, Cloud Computing, Cyber Security, and Software Engineering.',
                'description' => 'The Department of Computer Science & Engineering at Akal University offers industry-aligned academic programmes grounded in rigorous theoretical computing and hands-on laboratory experiences. Our faculty actively engage in cutting-edge research in Machine Learning, Distributed Computing, and Natural Language Processing.',
                'hero_image' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80',
                'logo' => null,
                'official_email' => 'cse@auts.ac.in',
                'contact_phone' => '+91-1655-257000',
                'office_location' => 'Academic Block 2, Ground Floor',
                'is_active' => true,
                'is_published' => true,
                'published_at' => now(),
                'sort_order' => 1,
            ]
        );

        $deptPhysics = Department::updateOrCreate(
            ['slug' => 'physics'],
            [
                'faculty_id' => $faculties['sciences']->id,
                'name' => 'Department of Physics',
                'code' => 'PHY',
                'short_description' => 'Fostering deep scientific exploration from quantum mechanics and materials science to astrophysics.',
                'description' => 'The Department of Physics provides an intellectually stimulating environment with modern research laboratories in condensed matter physics, spectroscopy, and nanoscience. Our students participate in national science forums and collaborate on funded research projects.',
                'hero_image' => 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=1400&q=80',
                'logo' => null,
                'official_email' => 'physics@auts.ac.in',
                'contact_phone' => '+91-1655-257010',
                'office_location' => 'Science Block, 1st Floor',
                'is_active' => true,
                'is_published' => true,
                'published_at' => now(),
                'sort_order' => 2,
            ]
        );

        $deptChemistry = Department::updateOrCreate(
            ['slug' => 'chemistry'],
            [
                'faculty_id' => $faculties['sciences']->id,
                'name' => 'Department of Chemistry',
                'code' => 'CHM',
                'short_description' => 'Center of excellence in chemical sciences, green chemistry, and drug discovery research.',
                'description' => 'The Department of Chemistry hosts active research groups in organic synthesis, environmental chemistry, and material characterization with sophisticated instrumentation facilities.',
                'hero_image' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1400&q=80',
                'official_email' => 'chemistry@auts.ac.in',
                'contact_phone' => '+91-1655-257020',
                'office_location' => 'Science Block, 2nd Floor',
                'is_active' => true,
                'is_published' => true,
                'published_at' => now(),
                'sort_order' => 3,
            ]
        );

        $deptMathematics = Department::updateOrCreate(
            ['slug' => 'mathematics'],
            [
                'faculty_id' => $faculties['sciences']->id,
                'name' => 'Department of Mathematics',
                'code' => 'MTH',
                'short_description' => 'Cultivating rigorous analytical and mathematical thinking for science, industry, and computational modeling.',
                'description' => 'The Department of Mathematics offers comprehensive undergraduate and postgraduate programs emphasizing pure and applied mathematics, computational statistics, and mathematical physics.',
                'hero_image' => 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1400&q=80',
                'official_email' => 'mathematics@auts.ac.in',
                'contact_phone' => '+91-1655-257030',
                'office_location' => 'Ramanujan Wing, 3rd Floor',
                'is_active' => true,
                'is_published' => true,
                'published_at' => now(),
                'sort_order' => 4,
            ]
        );

        $deptCommerce = Department::updateOrCreate(
            ['slug' => 'commerce-management'],
            [
                'faculty_id' => $faculties['commerce-management']->id,
                'name' => 'Commerce & Management',
                'code' => 'COM',
                'short_description' => 'Developing ethical, innovative, and strategic business leaders prepared for the global economy.',
                'description' => 'Our programmes combine corporate financial acumen, digital marketing, business analytics, and ethical leadership principles to mold future industry leaders and entrepreneurs.',
                'hero_image' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
                'official_email' => 'commerce@auts.ac.in',
                'contact_phone' => '+91-1655-257040',
                'office_location' => 'Management Complex, 1st Floor',
                'is_active' => true,
                'is_published' => true,
                'published_at' => now(),
                'sort_order' => 5,
            ]
        );

        // 3. Department Settings
        DepartmentSetting::updateOrCreate(
            ['department_id' => $deptCse->id],
            [
                'website_title' => 'Department of Computer Science & Engineering',
                'tagline' => 'Transforming Curiosity into Code & Innovations',
                'banner_title' => 'Where Innovation Meets Algorithmic Excellence',
                'banner_text' => 'Join one of the most vibrant computing faculties in North India, equipped with modern high-performance GPU clusters, cloud laboratories, and industry mentorship programs.',
                'about_text' => 'Established with a vision to deliver world-class technical education, the Department of CSE is recognized for its academic rigor, experienced faculty, and industry-collaborated curriculum. We focus on preparing students to solve real-world problems through advanced computing.',
                'hod_name' => 'Dr. Upinder Kaur',
                'hod_designation' => 'Professor & Head of Department',
                'hod_message' => 'Welcome to the Department of Computer Science & Engineering at Akal University. We are committed to fostering academic excellence, innovation, and ethical leadership in the field of technology. Our students learn by doing, and our faculty work relentlessly to bring the best industry standards into our lecture halls and research laboratories.',
                'contact_email' => 'cse@auts.ac.in',
                'contact_phone' => '+91-1655-257000',
                'contact_address' => 'Academic Block 2, Akal University Campus, Talwandi Sabo, Bathinda - 151302',
                'primary_color' => '#087BB5',
                'accent_color' => '#F9B900',
            ]
        );

        DepartmentSetting::updateOrCreate(
            ['department_id' => $deptPhysics->id],
            [
                'website_title' => 'Department of Physics',
                'tagline' => 'Exploring the Universe From Quarks to Galaxies',
                'banner_title' => 'Pioneering Research in Material Sciences & Quantum Physics',
                'banner_text' => 'Our faculty and researchers are actively engaged in funded national research projects, offering students unmatched laboratory opportunities.',
                'about_text' => 'The Department of Physics strives to impart high-quality education in physical sciences with strong emphasis on research orientation, analytical thinking, and scientific creativity.',
                'hod_name' => 'Dr. Sukhdeep Singh',
                'hod_designation' => 'Associate Professor & Head',
                'hod_message' => 'Physics is the foundational pillar of all scientific discovery. At Akal University, we provide students with hands-on exposure to advanced experimental techniques and computational modeling from the very first semester.',
                'contact_email' => 'physics@auts.ac.in',
                'contact_phone' => '+91-1655-257010',
                'contact_address' => 'Science Block, Akal University Campus, Talwandi Sabo, Bathinda - 151302',
                'primary_color' => '#087BB5',
                'accent_color' => '#F9B900',
            ]
        );

        // 4. Assign Admin User to CSE and Physics
        $deptAdmin = User::where('email', 'deptadmin@akal.ac.in')->first();
        if ($deptAdmin) {
            $deptAdmin->departments()->syncWithoutDetaching([$deptCse->id, $deptPhysics->id]);
        }

        // 5. Seed Faculty Members for CSE
        FacultyMember::where('department_id', $deptCse->id)->delete();
        $cseFaculty = [
            [
                'department_id' => $deptCse->id,
                'name' => 'Dr. Upinder Kaur',
                'designation' => 'Professor & Head',
                'qualification' => 'Ph.D. in Computer Science & Engineering',
                'specialization' => 'Cloud Computing, Distributed Systems & Big Data',
                'experience' => '16+ Years',
                'email' => 'upinder.cse@auts.ac.in',
                'phone' => '+91-98765-43210',
                'office_location' => 'Room 201, Academic Block 2',
                'research_interests' => 'Cloud Resource Management, Serverless Architectures, Internet of Things',
                'bio' => 'Dr. Upinder Kaur has published more than 40 research papers in peer-reviewed international journals and conferences indexed in Scopus/SCI.',
                'profile_image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
                'display_order' => 1,
                'status' => 'active',
            ],
            [
                'department_id' => $deptCse->id,
                'name' => 'Dr. Gurpreet Singh',
                'designation' => 'Associate Professor',
                'qualification' => 'Ph.D., M.Tech (CSE)',
                'specialization' => 'Machine Learning, Computer Vision',
                'experience' => '12 Years',
                'email' => 'gurpreet.cse@auts.ac.in',
                'phone' => '+91-98765-43211',
                'office_location' => 'Room 204, Academic Block 2',
                'research_interests' => 'Deep Learning, Medical Image Analysis, Pattern Recognition',
                'bio' => 'Leading the AI Research Group at Akal University with 2 ongoing DST-funded research grants.',
                'profile_image' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                'display_order' => 2,
                'status' => 'active',
            ],
            [
                'department_id' => $deptCse->id,
                'name' => 'Er. Harpreet Kaur',
                'designation' => 'Assistant Professor',
                'qualification' => 'M.Tech, Pursuing Ph.D.',
                'specialization' => 'Cyber Security, Cryptography',
                'experience' => '7 Years',
                'email' => 'harpreet.cse@auts.ac.in',
                'phone' => '+91-98765-43212',
                'office_location' => 'Room 205, Academic Block 2',
                'research_interests' => 'Network Security, Blockchain Technologies, Zero Trust Networks',
                'bio' => 'Coordinator of the University Cyber Security Club and Certified Ethical Hacker (CEH).',
                'profile_image' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
                'display_order' => 3,
                'status' => 'active',
            ],
            [
                'department_id' => $deptCse->id,
                'name' => 'Er. Manjinder Singh',
                'designation' => 'Assistant Professor',
                'qualification' => 'M.Tech, B.Tech (Honors)',
                'specialization' => 'Full Stack Web & Mobile Architecture',
                'experience' => '6 Years',
                'email' => 'manjinder.cse@auts.ac.in',
                'phone' => '+91-98765-43213',
                'office_location' => 'Room 208, Academic Block 2',
                'research_interests' => 'Web Systems, DevOps, Microservices Architecture',
                'bio' => 'Industry veteran with 4 years corporate software engineering experience prior to academia.',
                'profile_image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                'display_order' => 4,
                'status' => 'active',
            ],
        ];
        foreach ($cseFaculty as $f) {
            FacultyMember::create($f);
        }

        // 6. Seed Academic Programmes for CSE
        Programme::where('department_id', $deptCse->id)->delete();
        $cseProgrammes = [
            [
                'department_id' => $deptCse->id,
                'name' => 'B.Tech in Computer Science & Engineering',
                'code' => 'BTECH-CSE',
                'level' => 'undergraduate',
                'duration' => '4 Years (8 Semesters)',
                'eligibility' => '10+2 with Physics, Mathematics, and Chemistry/Computer Science with minimum 55% marks.',
                'intake' => '60 Seats',
                'description' => 'Comprehensive degree curriculum covering Algorithms, Data Structures, Operating Systems, Machine Learning, Cloud Architecture, and Capstone Engineering Projects.',
                'curriculum_highlights' => 'Includes mandatory 6-month industry internship, Git-based coursework, and specialization tracks in AI/ML and Cyber Security.',
                'status' => 'active',
                'sort_order' => 1,
            ],
            [
                'department_id' => $deptCse->id,
                'name' => 'Bachelor of Computer Applications (BCA)',
                'code' => 'BCA',
                'level' => 'undergraduate',
                'duration' => '3 Years (6 Semesters)',
                'eligibility' => '10+2 in any stream with Mathematics or Computer Applications as a subject.',
                'intake' => '40 Seats',
                'description' => 'Applied computer science degree focusing on software development, web frameworks, database systems, and mobile application engineering.',
                'curriculum_highlights' => 'Practical laboratory classes every semester, live enterprise project, soft skills and interview readiness training.',
                'status' => 'active',
                'sort_order' => 2,
            ],
            [
                'department_id' => $deptCse->id,
                'name' => 'M.Tech in Computer Science & Engineering',
                'code' => 'MTECH-CSE',
                'level' => 'postgraduate',
                'duration' => '2 Years (4 Semesters)',
                'eligibility' => 'B.Tech/B.E. in CSE/IT or MCA/M.Sc. Computer Science with minimum 60% aggregate.',
                'intake' => '18 Seats',
                'description' => 'Advanced postgraduate programme geared towards high-impact research, algorithmic design, machine intelligence, and dissertation research.',
                'curriculum_highlights' => 'Research methodology training, peer-reviewed paper publication requirement, access to university GPU compute facilities.',
                'status' => 'active',
                'sort_order' => 3,
            ],
            [
                'department_id' => $deptCse->id,
                'name' => 'Doctor of Philosophy (Ph.D.) in CSE',
                'code' => 'PHD-CSE',
                'level' => 'doctoral',
                'duration' => '3 to 5 Years',
                'eligibility' => 'Master degree in engineering/technology with at least 55% marks and qualifying university entrance or UGC-NET/GATE.',
                'intake' => '6 Seats',
                'description' => 'Doctoral research program supporting full-time and part-time researchers in machine learning, distributed computing, cyber physical systems, and wireless networks.',
                'curriculum_highlights' => 'University fellowship support, international conference travel grants, and co-supervision opportunities.',
                'status' => 'active',
                'sort_order' => 4,
            ],
        ];
        foreach ($cseProgrammes as $p) {
            Programme::create($p);
        }

        // 7. Seed Laboratories for CSE
        Laboratory::where('department_id', $deptCse->id)->delete();
        $cseLabs = [
            [
                'department_id' => $deptCse->id,
                'name' => 'Artificial Intelligence & Deep Learning Lab',
                'description' => 'High-performance computing facility equipped with dedicated NVIDIA RTX GPUs for training neural networks, vision models, and natural language transformers.',
                'facilities' => '30 Dell Workstations, Dual NVIDIA RTX 4090 Servers, High-speed Gigabit LAN, JupyterHub Server.',
                'equipment' => 'NVIDIA A100 GPU Cluster node, 32-core Xeon servers, 10Gbps local backbone.',
                'image_url' => 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
                'location' => 'Academic Block 2, Lab 201',
                'incharge_name' => 'Dr. Gurpreet Singh',
                'sort_order' => 1,
                'status' => 'active',
            ],
            [
                'department_id' => $deptCse->id,
                'name' => 'Cloud Computing & Cyber Security Lab',
                'description' => 'Dedicated sandbox laboratory for distributed systems, container orchestration, ethical hacking drills, and network traffic security audits.',
                'facilities' => '40 Terminals, OpenStack Private Cloud, Wireshark Packet Analyzers, Cisco Catalyst Managed Switches.',
                'equipment' => 'Cisco 2900 Series Routers, Fortinet Firewall appliance, VMware vSphere cluster.',
                'image_url' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
                'location' => 'Academic Block 2, Lab 202',
                'incharge_name' => 'Er. Harpreet Kaur',
                'sort_order' => 2,
                'status' => 'active',
            ],
            [
                'department_id' => $deptCse->id,
                'name' => 'Software Engineering & Web Systems Lab',
                'description' => 'Collaborative coding lab configured with full-stack development toolchains, continuous integration pipelines, and code review systems.',
                'facilities' => '45 Core i7 Systems, Dual 27-inch Monitors, Local GitLab and Docker Enterprise Registries.',
                'equipment' => 'Interactive Smart Boards, Video conferencing cameras for remote hackathons.',
                'image_url' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                'location' => 'Academic Block 2, Lab 203',
                'incharge_name' => 'Er. Manjinder Singh',
                'sort_order' => 3,
                'status' => 'active',
            ],
        ];
        foreach ($cseLabs as $l) {
            Laboratory::create($l);
        }

        // 8. Seed Events for CSE
        Event::where('department_id', $deptCse->id)->delete();
        $cseEvents = [
            [
                'department_id' => $deptCse->id,
                'title' => 'Akal TechHack 2026 – Annual 36-Hour National Hackathon',
                'description' => 'Inter-university coding competition bringing together more than 300 student innovators to build AI and sustainability solutions.',
                'event_date' => now()->addDays(20)->toDateString(),
                'end_date' => now()->addDays(22)->toDateString(),
                'venue' => 'University Auditorium & CSE Labs',
                'organizer' => 'CSE Coding Society & Tech Club',
                'category' => 'workshop',
                'image_url' => 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
                'registration_link' => 'https://auts.ac.in/events/techhack-2026',
                'is_featured' => true,
                'status' => 'upcoming',
            ],
            [
                'department_id' => $deptCse->id,
                'title' => 'International Workshop on Generative AI & Cloud Security',
                'description' => 'Keynote addresses and hands-on workshops delivered by tech leaders from Google Cloud, Microsoft, and premier IIT faculties.',
                'event_date' => now()->addDays(40)->toDateString(),
                'end_date' => now()->addDays(41)->toDateString(),
                'venue' => 'Seminar Hall 1',
                'organizer' => 'Department of CSE',
                'category' => 'seminar',
                'image_url' => 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
                'registration_link' => null,
                'is_featured' => true,
                'status' => 'upcoming',
            ],
            [
                'department_id' => $deptCse->id,
                'title' => 'National Science & Code Showcase 2025',
                'description' => 'Exhibition of capstone student projects, patent filings, and live mobile demonstrations for corporate visitors.',
                'event_date' => now()->subMonths(2)->toDateString(),
                'end_date' => null,
                'venue' => 'Central Library Concourse',
                'organizer' => 'Faculty of Engineering',
                'category' => 'academic',
                'image_url' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
                'registration_link' => null,
                'is_featured' => false,
                'status' => 'completed',
            ],
        ];
        foreach ($cseEvents as $e) {
            Event::create($e);
        }

        // 9. Seed Achievements for CSE
        Achievement::where('department_id', $deptCse->id)->delete();
        $cseAchievements = [
            [
                'department_id' => $deptCse->id,
                'title' => 'First Prize at Smart India Hackathon (SIH)',
                'description' => 'Team "ByteCrafters" of B.Tech CSE 3rd Year bagged the 1st prize worth INR 1,00,000 for their AI-driven crop disease prediction system.',
                'achievement_date' => now()->subMonths(3)->toDateString(),
                'category' => 'student',
                'recipient_name' => 'Simranpreet Singh & Team',
                'award_by' => 'Ministry of Education, Govt. of India',
                'image_url' => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
                'sort_order' => 1,
            ],
            [
                'department_id' => $deptCse->id,
                'title' => 'IEEE Best Research Paper Award 2025',
                'description' => 'Awarded for pioneering research paper on Efficient Edge Computing Protocols in Smart Grids at IEEE Globecom.',
                'achievement_date' => now()->subMonths(5)->toDateString(),
                'category' => 'faculty',
                'recipient_name' => 'Dr. Upinder Kaur',
                'award_by' => 'IEEE Communications Society',
                'image_url' => 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
                'sort_order' => 2,
            ],
        ];
        foreach ($cseAchievements as $a) {
            Achievement::create($a);
        }

        // 10. Seed Publications for CSE
        Publication::where('department_id', $deptCse->id)->delete();
        $csePublications = [
            [
                'department_id' => $deptCse->id,
                'title' => 'Adaptive Resource Allocation in Serverless Multi-Cloud Environments using Deep Q-Networks',
                'authors' => 'Upinder Kaur, Rajesh Kumar, and M. A. Zahoor',
                'journal_conference' => 'IEEE Transactions on Cloud Computing',
                'year' => 2025,
                'doi' => '10.1109/TCC.2025.3210452',
                'link' => 'https://doi.org/10.1109/TCC.2025.3210452',
                'abstract' => 'This paper presents an autonomous reinforcement learning framework for scaling microservices dynamically across hybrid cloud nodes with guaranteed SLA compliance.',
                'citation' => 'IEEE Trans. Cloud Comput., Vol. 13, Issue 2, pp. 412-428',
                'sort_order' => 1,
            ],
            [
                'department_id' => $deptCse->id,
                'title' => 'Self-Supervised Vision Transformers for Automated Diabetic Retinopathy Grading in Rural Healthcare',
                'authors' => 'Gurpreet Singh and Harpreet Kaur',
                'journal_conference' => 'Computers in Biology and Medicine (Elsevier)',
                'year' => 2024,
                'doi' => '10.1016/j.compbiomed.2024.108219',
                'link' => 'https://doi.org/10.1016/j.compbiomed.2024.108219',
                'abstract' => 'A lightweight transformer architecture capable of inferencing on edge medical devices with 98.4% diagnostic accuracy.',
                'citation' => 'Comput. Biol. Med., Vol. 170, 108219',
                'sort_order' => 2,
            ],
        ];
        foreach ($csePublications as $pub) {
            Publication::create($pub);
        }

        // 11. Seed Notices for CSE
        Notice::where('department_id', $deptCse->id)->delete();
        $cseNotices = [
            [
                'department_id' => $deptCse->id,
                'title' => 'Admissions Open for Academic Year 2026-27 (B.Tech & BCA)',
                'description' => 'Online registrations and scholarship test dates are now open. Merit scholarships up to 100% tuition waiver are available for eligible applicants.',
                'category' => 'admission',
                'publish_date' => now()->toDateString(),
                'expiry_date' => now()->addMonths(3)->toDateString(),
                'file_url' => 'https://auts.ac.in/docs/cse-admissions-2026.pdf',
                'is_important' => true,
                'is_active' => true,
            ],
            [
                'department_id' => $deptCse->id,
                'title' => 'Schedule for Mid-Term Practical Examinations (Even Semesters)',
                'description' => 'Students of B.Tech 4th, 6th and 8th semester are informed that practical evaluations will commence from next Monday in assigned laboratories.',
                'category' => 'exam',
                'publish_date' => now()->subDays(2)->toDateString(),
                'expiry_date' => now()->addDays(20)->toDateString(),
                'file_url' => 'https://auts.ac.in/docs/midterm-datesheet.pdf',
                'is_important' => true,
                'is_active' => true,
            ],
            [
                'department_id' => $deptCse->id,
                'title' => 'Guest Lecture on "Quantum Algorithms and Post-Quantum Cryptography"',
                'description' => 'All students and research scholars are invited to attend the guest session by Dr. A. Ramanathan, Senior Scientist, TIFR Mumbai.',
                'category' => 'academic',
                'publish_date' => now()->subDays(5)->toDateString(),
                'expiry_date' => now()->addDays(10)->toDateString(),
                'file_url' => null,
                'is_important' => false,
                'is_active' => true,
            ],
        ];
        foreach ($cseNotices as $n) {
            Notice::create($n);
        }

        // 12. Seed Galleries for CSE
        Gallery::where('department_id', $deptCse->id)->delete();
        $cseGalleries = [
            [
                'department_id' => $deptCse->id,
                'title' => 'Deep Learning Laboratory',
                'category' => 'labs',
                'image_url' => 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Students experimenting with vision transformers in the GPU research laboratory.',
                'alt_text' => 'Students coding in computer lab',
                'display_order' => 1,
            ],
            [
                'department_id' => $deptCse->id,
                'title' => 'Akal TechHack 2025 Finale',
                'category' => 'events',
                'image_url' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Winning teams receiving certificates and prizes at the tech hackathon ceremony.',
                'alt_text' => 'Award ceremony with students and professors',
                'display_order' => 2,
            ],
            [
                'department_id' => $deptCse->id,
                'title' => 'Robotics & IoT Demonstration',
                'category' => 'student_life',
                'image_url' => 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Autonomous drone and sensor prototype demo by 4th year B.Tech students.',
                'alt_text' => 'Robot demo on table',
                'display_order' => 3,
            ],
        ];
        foreach ($cseGalleries as $g) {
            Gallery::create($g);
        }

        // 13. Seed Custom Page Builder Sections for CSE
        $deptCse->sections()->delete();
        $cseSections = [
            [
                'department_id' => $deptCse->id,
                'title' => 'Vision and Mission',
                'subtitle' => 'Guiding Principles of the Department',
                'layout_type' => 'text',
                'content' => [
                    'body' => "Vision:\nTo become a premier center of excellence in computer science education, innovation, and ethical research recognized nationally for societal impact.\n\nMission:\n1. Deliver rigorous, cutting-edge education combining foundations and applied computing.\n2. Encourage multidisciplinary research addressing regional, national, and global challenges.\n3. Instill professional ethics, leadership values, and lifelong learning attitudes in students.",
                ],
                'settings' => ['background' => 'white'],
                'enabled' => true,
                'status' => 'published',
                'display_order' => 1,
            ],
            [
                'department_id' => $deptCse->id,
                'title' => 'Key Department Statistics',
                'subtitle' => 'Our Impact at a Glance',
                'layout_type' => 'statistics',
                'content' => [
                    'items' => [
                        ['value' => '94%', 'label' => 'Placement Record (2025)'],
                        ['value' => '₹18 LPA', 'label' => 'Highest Package'],
                        ['value' => '45+', 'label' => 'Scopus / SCI Publications'],
                        ['value' => '₹1.2 Cr', 'label' => 'Research Grants Awarded'],
                    ],
                ],
                'settings' => ['background' => 'light'],
                'enabled' => true,
                'status' => 'published',
                'display_order' => 2,
            ],
            [
                'department_id' => $deptCse->id,
                'title' => 'Specialization Tracks',
                'subtitle' => 'Career Focused Curricula for B.Tech CSE',
                'layout_type' => 'card_grid',
                'content' => [
                    'items' => [
                        [
                            'title' => 'Artificial Intelligence & Machine Learning',
                            'description' => 'Neural networks, generative models, natural language processing, and computer vision systems.',
                            'link' => null,
                        ],
                        [
                            'title' => 'Cloud Computing & DevOps',
                            'description' => 'Docker, Kubernetes, AWS architecture, microservices design, and continuous integration pipelines.',
                            'link' => null,
                        ],
                        [
                            'title' => 'Cyber Security & Digital Forensics',
                            'description' => 'Network defense, penetration testing, threat hunting, and modern cryptography standards.',
                            'link' => null,
                        ],
                    ],
                ],
                'settings' => ['columns' => 3, 'background' => 'white'],
                'enabled' => true,
                'status' => 'published',
                'display_order' => 3,
            ],
            [
                'department_id' => $deptCse->id,
                'title' => 'Department Growth Milestones',
                'subtitle' => 'Our Journey of Excellence',
                'layout_type' => 'timeline',
                'content' => [
                    'items' => [
                        ['date' => '2016', 'title' => 'Inception of Department', 'description' => 'Commenced operations with first B.Tech batch of 40 students.'],
                        ['date' => '2019', 'title' => 'AI Research Lab Inauguration', 'description' => 'Established state-of-the-art GPU workstation cluster funded by university trust.'],
                        ['date' => '2022', 'title' => 'Launch of Ph.D. Program', 'description' => 'First doctoral research cohort admitted under full university fellowship.'],
                        ['date' => '2025', 'title' => '100% Placement Milestone', 'description' => 'Graduating students placed across leading tech multinationals and startups.'],
                    ],
                ],
                'settings' => ['background' => 'light'],
                'enabled' => true,
                'status' => 'published',
                'display_order' => 4,
            ],
            [
                'department_id' => $deptCse->id,
                'title' => 'Frequently Asked Questions',
                'subtitle' => 'Everything You Need to Know',
                'layout_type' => 'accordion',
                'content' => [
                    'items' => [
                        [
                            'question' => 'What are the scholarship options available for B.Tech CSE students?',
                            'answer' => 'Akal University offers generous merit-based scholarships up to 100% fee waiver for students scoring 90%+ in 10+2 examinations, as well as special concessions for rural students and sports achievers.',
                        ],
                        [
                            'question' => 'Does the department assist with internships and corporate placements?',
                            'answer' => 'Yes, the Department of CSE has a dedicated Placement & Training cell that organizes coding bootcamps, soft-skill training, and on-campus recruitment drives with 40+ recruiting partners.',
                        ],
                        [
                            'question' => 'Can undergraduate students participate in funded research?',
                            'answer' => 'Absolutely. Under the Undergraduate Research Mentorship Scheme (URMS), students can join faculty-led research groups from their second year onward.',
                        ],
                    ],
                ],
                'settings' => ['background' => 'white'],
                'enabled' => true,
                'status' => 'published',
                'display_order' => 5,
            ],
        ];
        foreach ($cseSections as $sec) {
            DepartmentSection::create($sec);
        }

        // 14. Seed Content Revisions (to demonstrate Approval & Workflow)
        ContentRevision::where('department_id', $deptCse->id)->delete();
        $superAdmin = User::where('email', 'super@akal.ac.in')->first();

        // A pending revision submitted by Department Admin
        ContentRevision::create([
            'department_id' => $deptCse->id,
            'model_type' => 'section',
            'title' => 'New Section: Industry Advisory Board and Corporate Partners',
            'payload' => [
                'layout_type' => 'card_grid',
                'title' => 'Industry Advisory Board',
                'subtitle' => 'Guiding our Academic & Technical Curriculum',
                'content' => [
                    'items' => [
                        ['title' => 'TCS Digital Innovation Lab', 'description' => 'Industry partner for big data analytics projects.'],
                        ['title' => 'Infosys Springboard Campus', 'description' => 'Access to 1000+ industry courses for enrolled students.'],
                        ['title' => 'Cisco Networking Academy', 'description' => 'Hands-on routing and switching certification track.'],
                    ],
                ],
                'settings' => ['columns' => 3, 'background' => 'light'],
            ],
            'status' => 'pending',
            'user_id' => $deptAdmin?->id,
            'submitted_at' => now()->subHours(4),
        ]);

        // An approved revision ready for publication
        ContentRevision::create([
            'department_id' => $deptCse->id,
            'model_type' => 'section',
            'title' => 'Update to Lab Equipment & Hardware Specs',
            'payload' => [
                'layout_type' => 'text',
                'title' => 'Updated Research Infrastructure',
                'subtitle' => 'Latest hardware expansion',
                'content' => [
                    'body' => 'Added 10 new high-performance AI workstations equipped with NVIDIA RTX 4090 GPUs.',
                ],
                'settings' => ['background' => 'white'],
            ],
            'status' => 'approved',
            'user_id' => $deptAdmin?->id,
            'reviewer_id' => $superAdmin?->id,
            'review_comments' => 'Looks good. Lab updates verified by engineering dean.',
            'submitted_at' => now()->subDays(1),
            'reviewed_at' => now()->subHours(10),
        ]);

        // A rejected revision with feedback
        ContentRevision::create([
            'department_id' => $deptCse->id,
            'model_type' => 'settings',
            'title' => 'Proposed Change to Department Tagline & Color Palette',
            'payload' => [
                'tagline' => 'Akal University CSE - Coding the Next Generation',
                'primary_color' => '#FF0055',
            ],
            'status' => 'rejected',
            'user_id' => $deptAdmin?->id,
            'reviewer_id' => $superAdmin?->id,
            'review_comments' => 'Rejected: Changing primary colors must strictly adhere to the university-approved Akal Blue (#087BB5) and Akal Yellow (#F9B900) design system guidelines.',
            'submitted_at' => now()->subDays(3),
            'reviewed_at' => now()->subDays(2),
        ]);

        // 15. Activity Log Seed
        ActivityLog::log('seed_departments', 'Department and faculty catalog initialized with comprehensive university data.', $deptCse->id, $superAdmin?->id);
    }
}
