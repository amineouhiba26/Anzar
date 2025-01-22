package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.MediaTestSamples.*;
import static com.mycompany.myapp.domain.PropertyTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MediaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Media.class);
        Media media1 = getMediaSample1();
        Media media2 = new Media();
        assertThat(media1).isNotEqualTo(media2);

        media2.setId(media1.getId());
        assertThat(media1).isEqualTo(media2);

        media2 = getMediaSample2();
        assertThat(media1).isNotEqualTo(media2);
    }

    @Test
    void propertyTest() {
        Media media = getMediaRandomSampleGenerator();
        Property propertyBack = getPropertyRandomSampleGenerator();

        media.setProperty(propertyBack);
        assertThat(media.getProperty()).isEqualTo(propertyBack);

        media.property(null);
        assertThat(media.getProperty()).isNull();
    }
}
