package com.campusdinga.data;

import com.campusdinga.bookmark.Bookmark;
import com.campusdinga.bookmark.BookmarkRepository;
import com.campusdinga.lecture.Lecture;
import com.campusdinga.lecture.LectureRepository;
import com.campusdinga.location.Category;
import com.campusdinga.location.Location;
import com.campusdinga.location.LocationRepository;
import com.campusdinga.location.VerificationStatus;
import com.campusdinga.report.LocationReport;
import com.campusdinga.report.ReportRepository;
import com.campusdinga.service.CampusService;
import com.campusdinga.service.CampusServiceRepository;
import com.campusdinga.user.Role;
import com.campusdinga.user.User;
import com.campusdinga.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final LectureRepository lectureRepository;
    private final CampusServiceRepository serviceRepository;
    private final BookmarkRepository bookmarkRepository;
    private final ReportRepository reportRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      LocationRepository locationRepository,
                      LectureRepository lectureRepository,
                      CampusServiceRepository serviceRepository,
                      BookmarkRepository bookmarkRepository,
                      ReportRepository reportRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
        this.lectureRepository = lectureRepository;
        this.serviceRepository = serviceRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.reportRepository = reportRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Users
        User brian = new User("brian", "brian@maseno.ac.ke", passwordEncoder.encode("password123"), "Brian Kiprono", "BSc. Comp Sci", Role.ROLE_STUDENT);
        User admin = new User("admin", "admin@maseno.ac.ke", passwordEncoder.encode("admin123"), "Campus Administrator", "Estates & GIS Dept", Role.ROLE_ADMIN);
        userRepository.save(brian);
        userRepository.save(admin);

        // 2. Locations
        Location lab5 = new Location();
        lab5.setName("Computer Laboratory 5 (Lab 5)");
        lab5.setSlug("computer-lab-5");
        lab5.setCategory(Category.COMPUTER_LAB);
        lab5.setCampusArea("Siriba Campus");
        lab5.setBuildingBlock("Block B");
        lab5.setFloorLevel("1st Floor East");
        lab5.setRoomNumber("ROOM B-104");
        lab5.setDescription("Modern high-tech university computer laboratory with 60 high-performance desktop computers arranged in clean organized rows, bright recessed institutional lighting, and dedicated server rack.");
        lab5.setLatitude(-0.0035);
        lab5.setLongitude(34.6022);
        lab5.setAvailableFacilities("Gigabit LAN, Practical Exam Host terminal, Ubuntu Linux & Windows 11 dual boot, Laser departmental printing & air conditioning");
        lab5.setOpeningHours("Mon – Fri: 8:00 AM – 8:00 PM");
        lab5.setCurrentStatusLabel("Open Now • Practical Session");
        lab5.setWorkstationsCount(60);
        lab5.setHasSolarBackupPower(true);
        lab5.setWheelchairAccessible(true);
        lab5.setVerificationStatus(VerificationStatus.VERIFIED);
        lab5.setVerificationNotes("Verified by School of Computing GIS mapping team");
        lab5.setImageUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuDL3OBTLK7wJprMZTARLlPZjwSVrAlXOGi1k_92DKdZUDYk0PDXFfHO7CzBdOopCDOzrHW_WCyd6sR3DqUxTFNxT5H7KXI6-GgNWLForPSb-F9SM3pjOj2XUWiG2r_Zu71Fxccxga2W0eIQ2rFa1jwj9FsuJXj7Up9QHdCicKWJT-rPuJeI3_tqhdQWXX6Ie8wRa1l1LXYrf6TpgB8EKqXOzLoKfPRE1QdLIzlEXMf7mSWFs_RkSqsOMw");
        locationRepository.save(lab5);

        Location sciDept = new Location();
        sciDept.setName("School of Computing & Informatics");
        sciDept.setSlug("school-of-computing");
        sciDept.setCategory(Category.ACADEMIC_DEPARTMENT);
        sciDept.setCampusArea("Siriba Campus");
        sciDept.setBuildingBlock("Wing A");
        sciDept.setFloorLevel("Ground & 1st Floor");
        sciDept.setRoomNumber("DEAN-01");
        sciDept.setDescription("Faculty offices, software dev laboratories, student consultation suites.");
        sciDept.setLatitude(-0.0034);
        sciDept.setLongitude(34.6020);
        sciDept.setAvailableFacilities("Dean's Boardroom, Lecturers' Offices, Departmental Noticeboards, Postgraduate Computer Hub");
        sciDept.setOpeningHours("Mon – Fri: 8:00 AM – 5:00 PM");
        sciDept.setCurrentStatusLabel("Open Now");
        sciDept.setWorkstationsCount(40);
        sciDept.setHasSolarBackupPower(true);
        sciDept.setWheelchairAccessible(true);
        sciDept.setVerificationStatus(VerificationStatus.VERIFIED);
        sciDept.setVerificationNotes("Verified Dean's Office Registry");
        sciDept.setImageUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuAfEOtQvOrmX2oCHJH9UcgLB6AlPVS7smKIrnVLHuxEAcY7Obzta1wEAxKe8mTuJMn941a4OUFkr0bCt4WH7Xq9dJShO_4tu8jPXhLizFKVJuqUDrbSi_IIfypLBNj7Oh4FfGkNLu0cZBNg1xjjrrhFnHu24EhVIU6a6CaPXDz7_X9TgS_Q3FJRFHtmRV38HM30pHoRyJhq5kiHTlDnJJqheH6zJ3BePiioYWvQW2UzqwjXqBNuWLLXOA");
        locationRepository.save(sciDept);

        Location library = new Location();
        library.setName("Main University Library");
        library.setSlug("main-university-library");
        library.setCategory(Category.LIBRARY);
        library.setCampusArea("Central Quadrangle");
        library.setBuildingBlock("Library Complex");
        library.setFloorLevel("Ground, 1st & 2nd Floors");
        library.setRoomNumber("LIB-MAIN");
        library.setDescription("Quiet study floors, repository catalog, e-resource labs, printing stations.");
        library.setLatitude(-0.0042);
        library.setLongitude(34.6012);
        library.setAvailableFacilities("1,200 Reading Desks, High-speed Wi-Fi, Discussion Carrels, Cyber Lab, Book Loan Circulation Desk");
        library.setOpeningHours("Mon – Sat: 8:00 AM – 10:00 PM");
        library.setCurrentStatusLabel("Open Now • Quiet Study");
        library.setWorkstationsCount(1200);
        library.setHasSolarBackupPower(true);
        library.setWheelchairAccessible(true);
        library.setVerificationStatus(VerificationStatus.VERIFIED);
        library.setVerificationNotes("Verified by Library Department");
        locationRepository.save(library);

        Location mess = new Location();
        mess.setName("Central Student Mess");
        mess.setSlug("central-student-mess");
        mess.setCategory(Category.FOOD_AND_MESS);
        mess.setCampusArea("Siriba Campus");
        mess.setBuildingBlock("Students' Center Annex");
        mess.setFloorLevel("Ground Floor");
        mess.setRoomNumber("MESS-01");
        mess.setDescription("Affordable breakfast, lunch & snacks for students and university community.");
        mess.setLatitude(-0.0055);
        mess.setLongitude(34.6005);
        mess.setAvailableFacilities("Subsidized Meals, Tuck Shop, Refreshment Terrace, Handwashing Stations, Digital Cashless Pay");
        mess.setOpeningHours("Daily: 6:30 AM – 9:00 PM");
        mess.setCurrentStatusLabel("Open Now");
        mess.setWheelchairAccessible(true);
        mess.setVerificationStatus(VerificationStatus.VERIFIED);
        locationRepository.save(mess);

        Location adminOffice = new Location();
        adminOffice.setName("Academic Administration Office");
        adminOffice.setSlug("academic-administration-office");
        adminOffice.setCategory(Category.ADMINISTRATIVE_OFFICE);
        adminOffice.setCampusArea("Main Campus");
        adminOffice.setBuildingBlock("Administration Block");
        adminOffice.setFloorLevel("Ground Floor");
        adminOffice.setRoomNumber("ADM-G02");
        adminOffice.setDescription("Admissions, Transcripts & Registration, Fee clearing desk.");
        adminOffice.setLatitude(-0.0048);
        adminOffice.setLongitude(34.6010);
        adminOffice.setAvailableFacilities("Student Admissions Desk, Finance & Billing Window, Academic Registrar Inquiry, Exam Slips Collection");
        adminOffice.setOpeningHours("Mon – Fri: 8:00 AM – 5:00 PM");
        adminOffice.setCurrentStatusLabel("Open Now");
        adminOffice.setWheelchairAccessible(true);
        adminOffice.setVerificationStatus(VerificationStatus.VERIFIED);
        locationRepository.save(adminOffice);

        Location slt = new Location();
        slt.setName("Siriba Lecture Theatre (SLT 1 - 4)");
        slt.setSlug("siriba-lecture-theatre");
        slt.setCategory(Category.LECTURE_HALL);
        slt.setCampusArea("Siriba Campus");
        slt.setBuildingBlock("SLT Complex");
        slt.setFloorLevel("Ground Floor");
        slt.setRoomNumber("SLT 1-4");
        slt.setDescription("Tiered auditorium lecture halls accommodating large university undergraduate classes.");
        slt.setLatitude(-0.0046);
        slt.setLongitude(34.6002);
        slt.setAvailableFacilities("350 Seating Capacity, PA Audio Systems, Dual Projectors, Tiered Seating");
        slt.setOpeningHours("Mon – Sat: 7:00 AM – 7:00 PM");
        slt.setCurrentStatusLabel("In Session");
        slt.setWheelchairAccessible(true);
        slt.setVerificationStatus(VerificationStatus.VERIFIED);
        locationRepository.save(slt);

        Location health = new Location();
        health.setName("Health Centre");
        health.setSlug("health-centre");
        health.setCategory(Category.HEALTH_FACILITY);
        health.setCampusArea("Siriba Campus");
        health.setBuildingBlock("Dispensary Wing");
        health.setFloorLevel("Ground Floor");
        health.setRoomNumber("MED-01");
        health.setDescription("24/7 Outpatient health center and emergency triage for students and staff.");
        health.setLatitude(-0.0038);
        health.setLongitude(34.6028);
        health.setAvailableFacilities("Outpatient Clinic, Pharmacy, Emergency Ambulance Bay, Counseling Unit");
        health.setOpeningHours("24 Hours / 7 Days");
        health.setCurrentStatusLabel("Open 24/7");
        health.setWheelchairAccessible(true);
        health.setVerificationStatus(VerificationStatus.VERIFIED);
        locationRepository.save(health);

        Location sciComplex = new Location();
        sciComplex.setName("Science Complex");
        sciComplex.setSlug("science-complex");
        sciComplex.setCategory(Category.ACADEMIC_DEPARTMENT);
        sciComplex.setCampusArea("Main Campus");
        sciComplex.setBuildingBlock("Science Building");
        sciComplex.setFloorLevel("Ground & 1st Floor");
        sciComplex.setRoomNumber("SCI-101");
        sciComplex.setDescription("Biological & Chemical Sciences laboratories and lecture auditoriums.");
        sciComplex.setLatitude(-0.0058);
        sciComplex.setLongitude(34.6018);
        sciComplex.setAvailableFacilities("Chemistry Wet Labs, Biology Specimen Chamber, Physics Optics Lab");
        sciComplex.setOpeningHours("Mon – Fri: 8:00 AM – 6:00 PM");
        sciComplex.setCurrentStatusLabel("Open Now");
        sciComplex.setWheelchairAccessible(true);
        sciComplex.setVerificationStatus(VerificationStatus.VERIFIED);
        locationRepository.save(sciComplex);

        Location hostels = new Location();
        hostels.setName("Hostel 8 & 9 (Siriba Residences)");
        hostels.setSlug("hostel-8-and-9");
        hostels.setCategory(Category.HOSTEL);
        hostels.setCampusArea("Siriba Campus");
        hostels.setBuildingBlock("Hostel Zone");
        hostels.setFloorLevel("Floors 1-3");
        hostels.setRoomNumber("H8-001");
        hostels.setDescription("On-campus student residential accommodations.");
        hostels.setLatitude(-0.0045);
        hostels.setLongitude(34.6032);
        hostels.setAvailableFacilities("Student Rooms, Study Rooms, Security Gate, Common Hall");
        hostels.setOpeningHours("24/7 Access for Residents");
        hostels.setCurrentStatusLabel("Open");
        hostels.setVerificationStatus(VerificationStatus.VERIFIED);
        locationRepository.save(hostels);

        Location fountain = new Location();
        fountain.setName("Student Square Fountain");
        fountain.setSlug("student-square-fountain");
        fountain.setCategory(Category.OTHER);
        fountain.setCampusArea("Siriba Campus");
        fountain.setBuildingBlock("Central Concourse");
        fountain.setFloorLevel("Ground");
        fountain.setRoomNumber("PLAZA-01");
        fountain.setDescription("Central student square, circular fountain, and wayfinding junction.");
        fountain.setLatitude(-0.0052);
        fountain.setLongitude(34.6008);
        fountain.setAvailableFacilities("Pedestrian Crossroads, Seating, Open Quad");
        fountain.setOpeningHours("Open Always");
        fountain.setCurrentStatusLabel("Public Area");
        fountain.setVerificationStatus(VerificationStatus.VERIFIED);
        locationRepository.save(fountain);

        Location sports = new Location();
        sports.setName("University Sports Oval");
        sports.setSlug("university-sports-oval");
        sports.setCategory(Category.OTHER);
        sports.setCampusArea("Siriba Campus");
        sports.setBuildingBlock("Athletic Complex");
        sports.setFloorLevel("Field");
        sports.setRoomNumber("OVAL-01");
        sports.setDescription("Athletics running track, football pitch, and student sports events field.");
        sports.setLatitude(-0.0059);
        sports.setLongitude(34.6030);
        sports.setAvailableFacilities("Full-size Football Pitch, 400m Track, Grandstand Seating");
        sports.setOpeningHours("Daily: 6:00 AM – 7:00 PM");
        sports.setCurrentStatusLabel("Open");
        sports.setVerificationStatus(VerificationStatus.VERIFIED);
        locationRepository.save(sports);

        // 3. Lectures
        Lecture lec1 = new Lecture();
        lec1.setUnitCode("CSC 311");
        lec1.setUnitName("Data Structures and Algorithms");
        lec1.setLecturer("Dr. Ochieng");
        lec1.setDayOfWeek("Monday");
        lec1.setStartTime("10:00 AM");
        lec1.setEndTime("12:00 PM");
        lec1.setLocation(lab5);
        lec1.setRoomDescription("Siriba Campus Block B");
        lec1.setEstimatedMinutesWalk(4);
        lec1.setDistanceMeters(320);
        lectureRepository.save(lec1);

        Lecture lec2 = new Lecture();
        lec2.setUnitCode("CSC 312");
        lec2.setUnitName("Database Systems Implementation");
        lec2.setLecturer("Prof. Wafula");
        lec2.setDayOfWeek("Tuesday");
        lec2.setStartTime("8:00 AM");
        lec2.setEndTime("11:00 AM");
        lec2.setLocation(slt);
        lec2.setRoomDescription("Siriba Lecture Hall SLT 1");
        lec2.setEstimatedMinutesWalk(6);
        lec2.setDistanceMeters(450);
        lectureRepository.save(lec2);

        Lecture lec3 = new Lecture();
        lec3.setUnitCode("BIT 314");
        lec3.setUnitName("Network Administration & Security");
        lec3.setLecturer("Dr. Anyango");
        lec3.setDayOfWeek("Wednesday");
        lec3.setStartTime("2:00 PM");
        lec3.setEndTime("5:00 PM");
        lec3.setLocation(lab5);
        lec3.setRoomDescription("Siriba Campus Block B");
        lec3.setEstimatedMinutesWalk(4);
        lec3.setDistanceMeters(320);
        lectureRepository.save(lec3);

        Lecture lec4 = new Lecture();
        lec4.setUnitCode("MAT 202");
        lec4.setUnitName("Linear Algebra II");
        lec4.setLecturer("Dr. Otieno");
        lec4.setDayOfWeek("Thursday");
        lec4.setStartTime("11:00 AM");
        lec4.setEndTime("1:00 PM");
        lec4.setLocation(slt);
        lec4.setRoomDescription("Siriba Lecture Hall SLT 2");
        lec4.setEstimatedMinutesWalk(5);
        lec4.setDistanceMeters(400);
        lectureRepository.save(lec4);

        // 4. Campus Services
        CampusService serv1 = new CampusService();
        serv1.setName("University Main Cyber & Printing");
        serv1.setCategory("PRINTING_AND_STATIONERY");
        serv1.setDescription("High-speed printing, document binding, thesis printing, laminating, and digital scanning.");
        serv1.setLocation(library);
        serv1.setOperatingHours("Mon – Fri: 8:00 AM – 7:00 PM");
        serv1.setContactPhone("+254 700 123456");
        serv1.setAvailableOptions("Spiral Binding, Color A4/A3 Printing, Passport Photos, Document Scanning");
        serviceRepository.save(serv1);

        CampusService serv2 = new CampusService();
        serv2.setName("Siriba Cafeteria & Student Mess");
        serv2.setCategory("FOOD_AND_DINING");
        serv2.setDescription("Affordable, subsidized catering for students with clean indoor seating and fast takeaway.");
        serv2.setLocation(mess);
        serv2.setOperatingHours("Daily: 6:30 AM – 9:00 PM");
        serv2.setContactPhone("+254 700 234567");
        serv2.setAvailableOptions("Breakfast Chai & Mandazi, Lunch Ugali & Beef/Sukuma, Evening Supper");
        serviceRepository.save(serv2);

        CampusService serv3 = new CampusService();
        serv3.setName("Maseno Outpatient Health Dispensary");
        serv3.setCategory("HEALTH_SERVICES");
        serv3.setDescription("Student medical attention, emergency stabilization, medication prescription, and ambulance dispatch.");
        serv3.setLocation(health);
        serv3.setOperatingHours("24/7 All Days");
        serv3.setContactPhone("+254 700 345678");
        serv3.setAvailableOptions("General Outpatient, Rapid Malaria & Typhoid Testing, Student Wellness Counseling");
        serviceRepository.save(serv3);

        CampusService serv4 = new CampusService();
        serv4.setName("ICT Student Helpdesk & Portal Support");
        serv4.setCategory("IT_SUPPORT");
        serv4.setDescription("Student ERP portal password reset, Eduroam campus Wi-Fi access credentials, and LMS support.");
        serv4.setLocation(sciDept);
        serv4.setOperatingHours("Mon – Fri: 8:00 AM – 5:00 PM");
        serv4.setContactPhone("+254 700 456789");
        serv4.setAvailableOptions("Eduroam Wi-Fi configuration, Student Portal ERP clearance, Computer Lab access");
        serviceRepository.save(serv4);

        // 5. Seed Bookmarks for Brian
        bookmarkRepository.save(new Bookmark(brian, sciDept));
        bookmarkRepository.save(new Bookmark(brian, library));
        bookmarkRepository.save(new Bookmark(brian, mess));
        bookmarkRepository.save(new Bookmark(brian, adminOffice));

        // 6. Seed Sample Report
        LocationReport report = new LocationReport();
        report.setLocation(slt);
        report.setLocationName("Siriba Lecture Hall SLT 2");
        report.setReporterName("Brian Kiprono");
        report.setReporterEmail("brian@maseno.ac.ke");
        report.setIssueType("ROOM_CHANGE");
        report.setDescription("Whiteboard light is malfunctioning in the right corner, projector occasionally flickers.");
        report.setStatus("OPEN");
        reportRepository.save(report);
    }
}
