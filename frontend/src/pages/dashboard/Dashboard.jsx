import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import PageSection from "../../components/common/PageSection";

import StatisticsSection from "../../components/dashboard/StatisticsSection";
import RecentReservations from "../../components/dashboard/RecentReservations";

const Dashboard = () => {
    return (
        <PageContainer>

            <PageHeader
                title="Dashboard"
                subtitle="Monitor your car rental business at a glance."
            />

            <PageSection>
                <StatisticsSection />
            </PageSection>

            <PageSection>
                <RecentReservations />
            </PageSection>

        </PageContainer>
    );
};

export default Dashboard;