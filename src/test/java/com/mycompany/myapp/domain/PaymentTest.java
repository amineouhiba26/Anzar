package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.BookingTestSamples.*;
import static com.mycompany.myapp.domain.PaymentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PaymentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Payment.class);
        Payment payment1 = getPaymentSample1();
        Payment payment2 = new Payment();
        assertThat(payment1).isNotEqualTo(payment2);

        payment2.setId(payment1.getId());
        assertThat(payment1).isEqualTo(payment2);

        payment2 = getPaymentSample2();
        assertThat(payment1).isNotEqualTo(payment2);
    }

    @Test
    void bookingTest() {
        Payment payment = getPaymentRandomSampleGenerator();
        Booking bookingBack = getBookingRandomSampleGenerator();

        payment.setBooking(bookingBack);
        assertThat(payment.getBooking()).isEqualTo(bookingBack);

        payment.booking(null);
        assertThat(payment.getBooking()).isNull();
    }
}
