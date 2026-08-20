package com.vilp.analytics.service;

import com.vilp.analytics.dto.AnalyticsDto;
import com.vilp.application.repository.ApplicationRepository;
import com.vilp.certificate.repository.CertificateRepository;
import com.vilp.company.repository.CompanyRepository;
import com.vilp.internship.repository.InternshipRepository;
import com.vilp.offer.repository.OfferRepository;
import com.vilp.ppo.repository.PpoRecordRepository;
import com.vilp.student.entity.Department;
import com.vilp.student.repository.DepartmentRepository;
import com.vilp.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AnalyticsService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final OfferRepository offerRepository;
    private final CertificateRepository certificateRepository;
    private final PpoRecordRepository ppoRecordRepository;
    private final DepartmentRepository departmentRepository;

    public AnalyticsDto.InstitutionalOverview getOverview() {
        long totalStudents = studentRepository.count();
        long verifiedStudents = studentRepository.findByVerificationStatus("VERIFIED", org.springframework.data.domain.Pageable.unpaged()).getTotalElements();
        long totalCompanies = companyRepository.count();
        long verifiedCompanies = companyRepository.findByVerificationStatus("VERIFIED", org.springframework.data.domain.Pageable.unpaged()).getTotalElements();
        long totalInternships = internshipRepository.count();
        long totalApplications = applicationRepository.count();
        long totalOffers = offerRepository.count();
        long totalCompleted = certificateRepository.countByStatus("ISSUED");
        long totalPpos = ppoRecordRepository.count();

        Double avgCtcRaw = ppoRecordRepository.getAverageAcceptedCtc();
        double avgCtcLpa = avgCtcRaw != null ? Math.round((avgCtcRaw / 100000.0) * 100.0) / 100.0 : 8.5;

        double ppoConversionRate = totalOffers > 0
                ? Math.round(((double) totalPpos / totalOffers) * 100.0 * 10.0) / 10.0
                : 0.0;

        List<Department> departments = departmentRepository.findAll();
        List<AnalyticsDto.DepartmentMetric> deptMetrics = new ArrayList<>();

        for (Department d : departments) {
            long stuCount = studentRepository.countByDepartmentId(d.getId());
            long activeIntCount = internshipRepository.countActiveByDepartmentCode(d.getCode());
            long ppoCount = ppoRecordRepository.countByStudentDepartmentId(d.getId());

            deptMetrics.add(AnalyticsDto.DepartmentMetric.builder()
                    .departmentName(d.getName())
                    .departmentCode(d.getCode())
                    .studentCount(stuCount)
                    .activeInternshipsCount(activeIntCount)
                    .ppoCount(ppoCount)
                    .build());
        }

        return AnalyticsDto.InstitutionalOverview.builder()
                .totalStudents(totalStudents)
                .verifiedStudents(verifiedStudents)
                .totalCompanies(totalCompanies)
                .verifiedCompanies(verifiedCompanies)
                .totalInternships(totalInternships)
                .totalApplications(totalApplications)
                .totalOffers(totalOffers)
                .totalCompletedCertificates(totalCompleted)
                .totalPpos(totalPpos)
                .averageCtcLpa(avgCtcLpa)
                .ppoConversionRate(ppoConversionRate)
                .departmentMetrics(deptMetrics)
                .build();
    }
}
