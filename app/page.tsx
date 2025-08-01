import Header from "@/components/header";
import EventsContainer from "@/components/eventsConatiner";
export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <EventsContainer />
      </div>
    </>
  );
}
