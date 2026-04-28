import "./styles/Card.css";

function Card(){
    return(
        <div class="notification-card urgent">
            <div class="card-header">
                <div class="hospital-meta">
                    <h2>City Hospital</h2>
                    <p class="location-tag">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        Skopje Region
                    </p>
                </div>
                <div class="blood-type-square high-urgency">
                    <span class="type-label">TYPE</span>
                    <span class="type-value">A+</span>
                </div>
            </div>

            <div class="details-grid">
                <div class="detail-item">
                    <label>Required Qty</label>
                    <p>450ml (1 Unit)</p>
                </div>
                <div class="detail-item">
                    <label>Urgency</label>
                    <p class="urgency-text">High</p>
                </div>
                <div class="detail-item">
                    <label>Status</label>
                    <span class="status-sent">Sent</span>
                </div>
                <div class="detail-item">
                    <label>Request Date</label>
                    <p class="date-text">24 Mar 2026</p>
                </div>
            </div>

            <div class="card-message">
                <label>Message</label>
                <p>"Immediate need for A+ whole blood for emergency surgery. Your contribution can save a life today."</p>
            </div>
        </div>

    )
}

export default Card;