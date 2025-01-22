package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.BookingTestSamples.*;
import static com.mycompany.myapp.domain.CustomUserTestSamples.*;
import static com.mycompany.myapp.domain.PaymentTestSamples.*;
import static com.mycompany.myapp.domain.PropertyTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BookingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Booking.class);
        Booking booking1 = getBookingSample1();
        Booking booking2 = new Booking();
        assertThat(booking1).isNotEqualTo(booking2);

        booking2.setId(booking1.getId());
        assertThat(booking1).isEqualTo(booking2);

        booking2 = getBookingSample2();
        assertThat(booking1).isNotEqualTo(booking2);
    }

    @Test
    void propertyTest() {
        Booking booking = getBookingRandomSampleGenerator();
        Property propertyBack = getPropertyRandomSampleGenerator();

        booking.setProperty(propertyBack);
        assertThat(booking.getProperty()).isEqualTo(propertyBack);

        booking.property(null);
        assertThat(booking.getProperty()).isNull();
    }

    @Test
    void userTest() {
        Booking booking = getBookingRandomSampleGenerator();
        CustomUser customUserBack = getCustomUserRandomSampleGenerator();

        booking.setUser(customUserBack);
        assertThat(booking.getUser()).isEqualTo(customUserBack);

        booking.user(null);
        assertThat(booking.getUser()).isNull();
    }

    @Test
    void paymentTest() {
        Booking booking = getBookingRandomSampleGenerator();
        Payment paymentBack = getPaymentRandomSampleGenerator();

        booking.setPayment(paymentBack);
        assertThat(booking.getPayment()).isEqualTo(paymentBack);
        assertThat(paymentBack.getBooking()).isEqualTo(booking);

        booking.payment(null);
        assertThat(booking.getPayment()).isNull();
        assertThat(paymentBack.getBooking()).isNull();
    }
}
