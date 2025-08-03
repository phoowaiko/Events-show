import { fetchEvent } from "@/lib/data";
import Eventdetail from "./_components/eventdetail";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const eventDetailsPageProps = async ({ params }: Props) => {
  const { id } = await params;
  const data = await fetchEvent(id);

  return <Eventdetail event={data} />;
};

export default eventDetailsPageProps;
