package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AttributeGroupTestSamples.*;
import static com.mycompany.myapp.domain.CustomConfigurationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CustomConfigurationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CustomConfiguration.class);
        CustomConfiguration customConfiguration1 = getCustomConfigurationSample1();
        CustomConfiguration customConfiguration2 = new CustomConfiguration();
        assertThat(customConfiguration1).isNotEqualTo(customConfiguration2);

        customConfiguration2.setId(customConfiguration1.getId());
        assertThat(customConfiguration1).isEqualTo(customConfiguration2);

        customConfiguration2 = getCustomConfigurationSample2();
        assertThat(customConfiguration1).isNotEqualTo(customConfiguration2);
    }

    @Test
    void attributeGroupsTest() {
        CustomConfiguration customConfiguration = getCustomConfigurationRandomSampleGenerator();
        AttributeGroup attributeGroupBack = getAttributeGroupRandomSampleGenerator();

        customConfiguration.addAttributeGroups(attributeGroupBack);
        assertThat(customConfiguration.getAttributeGroups()).containsOnly(attributeGroupBack);
        assertThat(attributeGroupBack.getCustomConfiguration()).isEqualTo(customConfiguration);

        customConfiguration.removeAttributeGroups(attributeGroupBack);
        assertThat(customConfiguration.getAttributeGroups()).doesNotContain(attributeGroupBack);
        assertThat(attributeGroupBack.getCustomConfiguration()).isNull();

        customConfiguration.attributeGroups(new HashSet<>(Set.of(attributeGroupBack)));
        assertThat(customConfiguration.getAttributeGroups()).containsOnly(attributeGroupBack);
        assertThat(attributeGroupBack.getCustomConfiguration()).isEqualTo(customConfiguration);

        customConfiguration.setAttributeGroups(new HashSet<>());
        assertThat(customConfiguration.getAttributeGroups()).doesNotContain(attributeGroupBack);
        assertThat(attributeGroupBack.getCustomConfiguration()).isNull();
    }
}
