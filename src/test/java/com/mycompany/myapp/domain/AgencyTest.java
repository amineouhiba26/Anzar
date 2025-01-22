package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AdminTestSamples.*;
import static com.mycompany.myapp.domain.AgencyTestSamples.*;
import static com.mycompany.myapp.domain.CustomUserTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AgencyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Agency.class);
        Agency agency1 = getAgencySample1();
        Agency agency2 = new Agency();
        assertThat(agency1).isNotEqualTo(agency2);

        agency2.setId(agency1.getId());
        assertThat(agency1).isEqualTo(agency2);

        agency2 = getAgencySample2();
        assertThat(agency1).isNotEqualTo(agency2);
    }

    @Test
    void usersTest() {
        Agency agency = getAgencyRandomSampleGenerator();
        CustomUser customUserBack = getCustomUserRandomSampleGenerator();

        agency.addUsers(customUserBack);
        assertThat(agency.getUsers()).containsOnly(customUserBack);
        assertThat(customUserBack.getAgency()).isEqualTo(agency);

        agency.removeUsers(customUserBack);
        assertThat(agency.getUsers()).doesNotContain(customUserBack);
        assertThat(customUserBack.getAgency()).isNull();

        agency.users(new HashSet<>(Set.of(customUserBack)));
        assertThat(agency.getUsers()).containsOnly(customUserBack);
        assertThat(customUserBack.getAgency()).isEqualTo(agency);

        agency.setUsers(new HashSet<>());
        assertThat(agency.getUsers()).doesNotContain(customUserBack);
        assertThat(customUserBack.getAgency()).isNull();
    }

    @Test
    void adminTest() {
        Agency agency = getAgencyRandomSampleGenerator();
        Admin adminBack = getAdminRandomSampleGenerator();

        agency.setAdmin(adminBack);
        assertThat(agency.getAdmin()).isEqualTo(adminBack);
        assertThat(adminBack.getAgency()).isEqualTo(agency);

        agency.admin(null);
        assertThat(agency.getAdmin()).isNull();
        assertThat(adminBack.getAgency()).isNull();
    }
}
