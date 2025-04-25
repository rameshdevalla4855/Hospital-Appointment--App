class DoctorRating {
    constructor(doctorId) {
        this.doctorId = doctorId;
        this.ratings = [];
    }

    addRating(rating) {
        this.ratings.push(rating);
        this.saveRatings();
    }

    calculateAverageRating() {
        if (this.ratings.length === 0) return 0;
        const sum = this.ratings.reduce((a, b) => a + b, 0);
        return (sum / this.ratings.length).toFixed(1);
    }

    saveRatings() {
        localStorage.setItem(`doctor_${this.doctorId}_ratings`, JSON.stringify(this.ratings));
    }

    loadRatings() {
        const savedRatings = localStorage.getItem(`doctor_${this.doctorId}_ratings`);
        if (savedRatings) {
            this.ratings = JSON.parse(savedRatings);
        }
    }
}
