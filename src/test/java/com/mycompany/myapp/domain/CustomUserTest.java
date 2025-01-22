package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AgencyTestSamples.*;
import static com.mycompany.myapp.domain.CustomUserTestSamples.*;
import static com.mycompany.myapp.domain.RoleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CustomUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CustomUser.class);
        CustomUser customUser1 = getCustomUserSample1();
        CustomUser customUser2 = new CustomUser();
        assertThat(customUser1).isNotEqualTo(customUser2);

        customUser2.setId(customUser1.getId());
        assertThat(customUser1).isEqualTo(customUser2);

        customUser2 = getCustomUserSample2();
        assertThat(customUser1).isNotEqualTo(customUser2);
    }

    @Test
    void roleTest() {
        CustomUser customUser = getCustomUserRandomSampleGenerator();
        Role roleBack = getRoleRandomSampleGenerator();

        customUser.setRole(roleBack);
        assertThat(customUser.getRole()).isEqualTo(roleBack);

        customUser.role(null);
        assertThat(customUser.getRole()).isNull();
    }

    @Test
    void agencyTest() {
        CustomUser customUser = getCustomUserRandomSampleGenerator();
        Agency agencyBack = getAgencyRandomSampleGenerator();

        customUser.setAgency(agencyBack);
        assertThat(customUser.getAgency()).isEqualTo(agencyBack);

        customUser.agency(null);
        assertThat(customUser.getAgency()).isNull();
    }
}
