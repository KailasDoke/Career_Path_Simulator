package com.careerpaths.util;

import com.careerpaths.entity.*;
import com.careerpaths.entity.enums.*;
import com.careerpaths.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class KnowledgeBaseDataSeeder implements CommandLineRunner {

    private final CountryRepository countryRepository;
    private final InstitutionRepository institutionRepository;
    private final ProgramRepository programRepository;
    private final CareerRepository careerRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final EducationLoanRepository loanRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;

    public KnowledgeBaseDataSeeder(CountryRepository countryRepository, 
                                   InstitutionRepository institutionRepository, 
                                   ProgramRepository programRepository, 
                                   CareerRepository careerRepository,
                                   ScholarshipRepository scholarshipRepository,
                                   EducationLoanRepository loanRepository,
                                   UserRepository userRepository,
                                   StudentProfileRepository studentProfileRepository) {
        this.countryRepository = countryRepository;
        this.institutionRepository = institutionRepository;
        this.programRepository = programRepository;
        this.careerRepository = careerRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (countryRepository.count() == 0) {
            seedCountries();
        }
        if (careerRepository.count() == 0) {
            seedCareers();
        }
        if (institutionRepository.count() == 0) {
            seedInstitutionsAndPrograms();
        }
        if (scholarshipRepository.count() == 0) {
            seedFinances();
        }
        if (studentProfileRepository.count() == 0) {
            seedDemoStudent();
        }
    }

    private void seedDemoStudent() {
        User user = new User();
        user.setEmail("demo@student.com");
        user.setPasswordHash("demo");
        userRepository.save(user);

        StudentProfile profile = new StudentProfile();
        profile.setUser(user);
        profile.setFirstName("Demo");
        profile.setLastName("Student");

        AcademicRecord ar = new AcademicRecord();
        ar.setClass10Percentage(88.0);
        ar.setAcademicStrengths("Maths, Science");
        ar.setStudentProfile(profile);
        profile.setAcademicRecord(ar);

        InterestProfile ip = new InterestProfile();
        ip.setTechnologyScore(90);
        ip.setEngineeringScore(85);
        ip.setResearchScore(80);
        ip.setStudentProfile(profile);
        profile.setInterestProfile(ip);

        AptitudeResult apt = new AptitudeResult();
        apt.setProblemSolvingScore(85);
        apt.setLogicalReasoningScore(80);
        apt.setNumericalReasoningScore(88);
        apt.setStudentProfile(profile);
        profile.setAptitudeResult(apt);

        FinancialProfile fp = new FinancialProfile();
        fp.setMaximumTotalBudget(new BigDecimal("300000"));
        fp.setWillingToTakeLoan(true);
        fp.setRequiresScholarship(true);
        fp.setStudentProfile(profile);
        profile.setFinancialProfile(fp);

        LocationPreference lp = new LocationPreference();
        lp.setPreferredCountry("India");
        lp.setWillingToStudyAbroad(true);
        lp.setStudentProfile(profile);
        profile.setLocationPreference(lp);

        studentProfileRepository.save(profile);
    }

    private void seedFinances() {
        Scholarship s1 = Scholarship.builder()
            .name("Global Excellence Tech Scholarship")
            .provider("Tech Foundation")
            .benefitAmount(new BigDecimal("200000"))
            .minGpa(85.0)
            .targetCountryCode("IN")
            .requiredDocuments("Transcripts, LORs")
            .applicationInformation("Apply online by Dec 1")
            .build();
        s1.setSourceType("DEMO");
        s1.setEligibilityCriteria("Open to all tech students in India with GPA > 85%");

        Scholarship s2 = Scholarship.builder()
            .name("Need-based Aid Grant")
            .provider("Gov")
            .benefitAmount(new BigDecimal("50000"))
            .maxFamilyIncome(new BigDecimal("300000"))
            .requiredDocuments("Income Certificate")
            .build();
        s2.setSourceType("DEMO");
        s2.setEligibilityCriteria("For students with family income under 3L");

        scholarshipRepository.saveAll(Arrays.asList(s1, s2));

        EducationLoan l1 = EducationLoan.builder()
            .lenderName("State Bank")
            .maxLoanAmount(new BigDecimal("2000000"))
            .interestRate(8.5)
            .interestType("FLOATING")
            .maxTenureMonths(180)
            .moratoriumMonths(6)
            .processingFee(new BigDecimal("10000"))
            .collateralRequired(false)
            .build();
        l1.setSourceType("DEMO");

        EducationLoan l2 = EducationLoan.builder()
            .lenderName("Private Finance")
            .maxLoanAmount(new BigDecimal("5000000"))
            .interestRate(11.0)
            .interestType("FIXED")
            .maxTenureMonths(120)
            .moratoriumMonths(0)
            .processingFee(new BigDecimal("0"))
            .collateralRequired(true)
            .build();
        l2.setSourceType("DEMO");

        loanRepository.saveAll(Arrays.asList(l1, l2));
    }

    private void seedCountries() {
        List<String[]> countries = Arrays.asList(
            new String[]{"India", "IN"}, 
            new String[]{"Germany", "DE"}, 
            new String[]{"Canada", "CA"}, 
            new String[]{"Australia", "AU"}
        );
        for (String[] cData : countries) {
            Country country = Country.builder().name(cData[0]).code(cData[1]).build();
            country.setSourceType("DEMO");
            country.setSource("Demo Dataset");
            country.setVerificationStatus("UNVERIFIED");
            countryRepository.save(country);
        }
    }

    private void seedCareers() {
        Career c1 = Career.builder().title("Software Engineer").domain(CareerDomain.SOFTWARE_ENGINEERING)
                .description("Design, develop, and test software applications.")
                .prerequisiteAreas(Arrays.asList("Programming", "Data Structures", "Algorithms"))
                .possibleHigherEducationPaths(Arrays.asList("M.Sc Computer Science", "MBA IT")).build();
        c1.setSourceType("DEMO");

        Career c2 = Career.builder().title("Data Scientist").domain(CareerDomain.DATA)
                .description("Analyze and interpret complex data.")
                .prerequisiteAreas(Arrays.asList("Statistics", "Python", "Machine Learning"))
                .possibleHigherEducationPaths(Arrays.asList("M.Sc Data Science", "Ph.D.")).build();
        c2.setSourceType("DEMO");

        Career c3 = Career.builder().title("Surgeon").domain(CareerDomain.HEALTHCARE)
                .description("Perform operations to treat injuries or diseases.")
                .prerequisiteAreas(Arrays.asList("Anatomy", "Biology", "Clinical Rotation"))
                .possibleHigherEducationPaths(Arrays.asList("M.D.", "Residency")).build();
        c3.setSourceType("DEMO");

        Career c4 = Career.builder().title("Investment Banker").domain(CareerDomain.FINANCE)
                .description("Raise capital and provide financial advice.")
                .prerequisiteAreas(Arrays.asList("Corporate Finance", "Accounting", "Economics"))
                .possibleHigherEducationPaths(Arrays.asList("MBA Finance")).build();
        c4.setSourceType("DEMO");

        Career c5 = Career.builder().title("Marketing Manager").domain(CareerDomain.BUSINESS)
                .description("Direct marketing campaigns and strategies.")
                .prerequisiteAreas(Arrays.asList("Marketing Strategy", "Consumer Behavior"))
                .possibleHigherEducationPaths(Arrays.asList("MBA", "M.Sc Marketing")).build();
        c5.setSourceType("DEMO");

        Career c6 = Career.builder().title("Research Scientist").domain(CareerDomain.RESEARCH)
                .description("Conduct scientific experiments and studies.")
                .prerequisiteAreas(Arrays.asList("Research Methodology", "Statistics", "Domain Expertise"))
                .possibleHigherEducationPaths(Arrays.asList("Ph.D.", "Postdoc")).build();
        c6.setSourceType("DEMO");

        Career c7 = Career.builder().title("UX/UI Designer").domain(CareerDomain.DESIGN)
                .description("Design user interfaces and improve user experience.")
                .prerequisiteAreas(Arrays.asList("Design Thinking", "Figma", "Prototyping"))
                .possibleHigherEducationPaths(Arrays.asList("M.Des")).build();
        c7.setSourceType("DEMO");

        Career c8 = Career.builder().title("Mechanical Engineer").domain(CareerDomain.ENGINEERING)
                .description("Design and manufacture mechanical systems.")
                .prerequisiteAreas(Arrays.asList("Thermodynamics", "CAD", "Mechanics"))
                .possibleHigherEducationPaths(Arrays.asList("M.Sc Mechanical Engineering")).build();
        c8.setSourceType("DEMO");

        Career c9 = Career.builder().title("Environmental Scientist").domain(CareerDomain.ENVIRONMENT)
                .description("Protect the environment and human health.")
                .prerequisiteAreas(Arrays.asList("Ecology", "Chemistry", "Geology"))
                .possibleHigherEducationPaths(Arrays.asList("M.Sc Environmental Science")).build();
        c9.setSourceType("DEMO");

        careerRepository.saveAll(Arrays.asList(c1, c2, c3, c4, c5, c6, c7, c8, c9));
    }

    private void seedInstitutionsAndPrograms() {
        Country india = countryRepository.findAll().stream().filter(c -> c.getName().equals("India")).findFirst().orElse(null);
        Country canada = countryRepository.findAll().stream().filter(c -> c.getName().equals("Canada")).findFirst().orElse(null);
        Country germany = countryRepository.findAll().stream().filter(c -> c.getName().equals("Germany")).findFirst().orElse(null);
        Country australia = countryRepository.findAll().stream().filter(c -> c.getName().equals("Australia")).findFirst().orElse(null);

        if (india == null || canada == null || germany == null || australia == null) return;

        Institution iit = Institution.builder().name("Indian Institute of Technology (Demo)").country(india).city("Delhi").type(InstitutionType.PUBLIC_UNIVERSITY).estimatedLivingCostAnnual(new BigDecimal("150000")).build();
        iit.setSourceType("DEMO");
        institutionRepository.save(iit);

        Institution uoft = Institution.builder().name("University of Toronto (Demo)").country(canada).city("Toronto").type(InstitutionType.PUBLIC_UNIVERSITY).estimatedLivingCostAnnual(new BigDecimal("25000")).build();
        uoft.setSourceType("DEMO");
        institutionRepository.save(uoft);

        Institution tum = Institution.builder().name("Technical University of Munich (Demo)").country(germany).city("Munich").type(InstitutionType.PUBLIC_UNIVERSITY).estimatedLivingCostAnnual(new BigDecimal("12000")).build();
        tum.setSourceType("DEMO");
        institutionRepository.save(tum);

        Institution unimelb = Institution.builder().name("University of Melbourne (Demo)").country(australia).city("Melbourne").type(InstitutionType.PUBLIC_UNIVERSITY).estimatedLivingCostAnnual(new BigDecimal("30000")).build();
        unimelb.setSourceType("DEMO");
        institutionRepository.save(unimelb);

        Program p1 = Program.builder().name("B.Tech Computer Science").institution(iit).country(india).degree("B.Tech").educationLevel(EducationLevel.BACHELORS).durationYears(4.0).totalTuition(new BigDecimal("800000")).build();
        p1.setAdmissionRequirements(Arrays.asList(new AdmissionRequirement("maths_score", ">=", "80")));
        p1.setCareerDomains(Arrays.asList(CareerDomain.SOFTWARE_ENGINEERING, CareerDomain.DATA));
        p1.setSourceType("DEMO");
        
        Program p2 = Program.builder().name("B.Sc Engineering").institution(tum).country(germany).degree("B.Sc").educationLevel(EducationLevel.BACHELORS).durationYears(3.0).totalTuition(new BigDecimal("0")).build();
        p2.setAdmissionRequirements(Arrays.asList(new AdmissionRequirement("physics_score", ">=", "75")));
        p2.setCareerDomains(Arrays.asList(CareerDomain.ENGINEERING));
        p2.setSourceType("DEMO");

        Program p3 = Program.builder().name("Doctor of Medicine").institution(unimelb).country(australia).degree("M.D.").educationLevel(EducationLevel.PHD).durationYears(4.0).totalTuition(new BigDecimal("350000")).build();
        p3.setAdmissionRequirements(Arrays.asList(new AdmissionRequirement("gamsat_score", ">=", "65")));
        p3.setCareerDomains(Arrays.asList(CareerDomain.HEALTHCARE));
        p3.setSourceType("DEMO");

        Program p4 = Program.builder().name("Bachelor of Commerce").institution(uoft).country(canada).degree("B.Com").educationLevel(EducationLevel.BACHELORS).durationYears(4.0).totalTuition(new BigDecimal("40000")).build();
        p4.setAdmissionRequirements(Arrays.asList(new AdmissionRequirement("high_school_gpa", ">=", "3.2")));
        p4.setCareerDomains(Arrays.asList(CareerDomain.BUSINESS, CareerDomain.FINANCE));
        p4.setSourceType("DEMO");

        Program p5 = Program.builder().name("B.Sc Biotechnology").institution(iit).country(india).degree("B.Sc").educationLevel(EducationLevel.BACHELORS).durationYears(4.0).totalTuition(new BigDecimal("600000")).build();
        p5.setAdmissionRequirements(Arrays.asList(new AdmissionRequirement("biology_score", ">=", "85")));
        p5.setCareerDomains(Arrays.asList(CareerDomain.RESEARCH));
        p5.setSourceType("DEMO");

        Program p6 = Program.builder().name("B.Sc Mathematics").institution(tum).country(germany).degree("B.Sc").educationLevel(EducationLevel.BACHELORS).durationYears(3.0).totalTuition(new BigDecimal("0")).build();
        p6.setAdmissionRequirements(Arrays.asList(new AdmissionRequirement("maths_score", ">=", "90")));
        p6.setCareerDomains(Arrays.asList(CareerDomain.DATA, CareerDomain.RESEARCH));
        p6.setSourceType("DEMO");

        Program p7 = Program.builder().name("Bachelor of Design").institution(unimelb).country(australia).degree("B.Des").educationLevel(EducationLevel.BACHELORS).durationYears(3.0).totalTuition(new BigDecimal("120000")).build();
        p7.setAdmissionRequirements(Arrays.asList(new AdmissionRequirement("portfolio_score", ">=", "70")));
        p7.setCareerDomains(Arrays.asList(CareerDomain.DESIGN));
        p7.setSourceType("DEMO");

        programRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7));
    }
}
