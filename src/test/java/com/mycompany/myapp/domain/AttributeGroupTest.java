package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AttributeGroupTestSamples.*;
import static com.mycompany.myapp.domain.AttributeTestSamples.*;
import static com.mycompany.myapp.domain.CustomConfigurationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AttributeGroupTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AttributeGroup.class);
        AttributeGroup attributeGroup1 = getAttributeGroupSample1();
        AttributeGroup attributeGroup2 = new AttributeGroup();
        assertThat(attributeGroup1).isNotEqualTo(attributeGroup2);

        attributeGroup2.setId(attributeGroup1.getId());
        assertThat(attributeGroup1).isEqualTo(attributeGroup2);

        attributeGroup2 = getAttributeGroupSample2();
        assertThat(attributeGroup1).isNotEqualTo(attributeGroup2);
    }

    @Test
    void attributesTest() {
        AttributeGroup attributeGroup = getAttributeGroupRandomSampleGenerator();
        Attribute attributeBack = getAttributeRandomSampleGenerator();

        attributeGroup.addAttributes(attributeBack);
        assertThat(attributeGroup.getAttributes()).containsOnly(attributeBack);
        assertThat(attributeBack.getAttributeGroup()).isEqualTo(attributeGroup);

        attributeGroup.removeAttributes(attributeBack);
        assertThat(attributeGroup.getAttributes()).doesNotContain(attributeBack);
        assertThat(attributeBack.getAttributeGroup()).isNull();

        attributeGroup.attributes(new HashSet<>(Set.of(attributeBack)));
        assertThat(attributeGroup.getAttributes()).containsOnly(attributeBack);
        assertThat(attributeBack.getAttributeGroup()).isEqualTo(attributeGroup);

        attributeGroup.setAttributes(new HashSet<>());
        assertThat(attributeGroup.getAttributes()).doesNotContain(attributeBack);
        assertThat(attributeBack.getAttributeGroup()).isNull();
    }

    @Test
    void customConfigurationTest() {
        AttributeGroup attributeGroup = getAttributeGroupRandomSampleGenerator();
        CustomConfiguration customConfigurationBack = getCustomConfigurationRandomSampleGenerator();

        attributeGroup.setCustomConfiguration(customConfigurationBack);
        assertThat(attributeGroup.getCustomConfiguration()).isEqualTo(customConfigurationBack);

        attributeGroup.customConfiguration(null);
        assertThat(attributeGroup.getCustomConfiguration()).isNull();
    }
}
