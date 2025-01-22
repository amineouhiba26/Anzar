package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AttributeGroupTestSamples.*;
import static com.mycompany.myapp.domain.AttributeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AttributeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Attribute.class);
        Attribute attribute1 = getAttributeSample1();
        Attribute attribute2 = new Attribute();
        assertThat(attribute1).isNotEqualTo(attribute2);

        attribute2.setId(attribute1.getId());
        assertThat(attribute1).isEqualTo(attribute2);

        attribute2 = getAttributeSample2();
        assertThat(attribute1).isNotEqualTo(attribute2);
    }

    @Test
    void attributeGroupTest() {
        Attribute attribute = getAttributeRandomSampleGenerator();
        AttributeGroup attributeGroupBack = getAttributeGroupRandomSampleGenerator();

        attribute.setAttributeGroup(attributeGroupBack);
        assertThat(attribute.getAttributeGroup()).isEqualTo(attributeGroupBack);

        attribute.attributeGroup(null);
        assertThat(attribute.getAttributeGroup()).isNull();
    }
}
