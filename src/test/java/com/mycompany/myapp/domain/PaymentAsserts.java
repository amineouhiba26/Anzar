package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AssertUtils.bigDecimalCompareTo;
import static com.mycompany.myapp.domain.AssertUtils.zonedDataTimeSameInstant;
import static org.assertj.core.api.Assertions.assertThat;

public class PaymentAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPaymentAllPropertiesEquals(Payment expected, Payment actual) {
        assertPaymentAutoGeneratedPropertiesEquals(expected, actual);
        assertPaymentAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPaymentAllUpdatablePropertiesEquals(Payment expected, Payment actual) {
        assertPaymentUpdatableFieldsEquals(expected, actual);
        assertPaymentUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPaymentAutoGeneratedPropertiesEquals(Payment expected, Payment actual) {
        assertThat(expected)
            .as("Verify Payment auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPaymentUpdatableFieldsEquals(Payment expected, Payment actual) {
        assertThat(expected)
            .as("Verify Payment relevant properties")
            .satisfies(e -> assertThat(e.getAmount()).as("check amount").usingComparator(bigDecimalCompareTo).isEqualTo(actual.getAmount()))
            .satisfies(e -> assertThat(e.getStatus()).as("check status").isEqualTo(actual.getStatus()))
            .satisfies(e -> assertThat(e.getCreatedBy()).as("check createdBy").isEqualTo(actual.getCreatedBy()))
            .satisfies(e ->
                assertThat(e.getCreatedDate())
                    .as("check createdDate")
                    .usingComparator(zonedDataTimeSameInstant)
                    .isEqualTo(actual.getCreatedDate())
            )
            .satisfies(e -> assertThat(e.getLastModifiedBy()).as("check lastModifiedBy").isEqualTo(actual.getLastModifiedBy()))
            .satisfies(e ->
                assertThat(e.getLastModifiedDate())
                    .as("check lastModifiedDate")
                    .usingComparator(zonedDataTimeSameInstant)
                    .isEqualTo(actual.getLastModifiedDate())
            );
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPaymentUpdatableRelationshipsEquals(Payment expected, Payment actual) {
        assertThat(expected)
            .as("Verify Payment relationships")
            .satisfies(e -> assertThat(e.getBooking()).as("check booking").isEqualTo(actual.getBooking()));
    }
}
