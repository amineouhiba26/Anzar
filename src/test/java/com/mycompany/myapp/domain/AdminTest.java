package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AdminTestSamples.*;
import static com.mycompany.myapp.domain.AgencyTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AdminTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Admin.class);
        Admin admin1 = getAdminSample1();
        Admin admin2 = new Admin();
        assertThat(admin1).isNotEqualTo(admin2);

        admin2.setId(admin1.getId());
        assertThat(admin1).isEqualTo(admin2);

        admin2 = getAdminSample2();
        assertThat(admin1).isNotEqualTo(admin2);
    }

    @Test
    void agencyTest() {
        Admin admin = getAdminRandomSampleGenerator();
        Agency agencyBack = getAgencyRandomSampleGenerator();

        admin.setAgency(agencyBack);
        assertThat(admin.getAgency()).isEqualTo(agencyBack);

        admin.agency(null);
        assertThat(admin.getAgency()).isNull();
    }
}
