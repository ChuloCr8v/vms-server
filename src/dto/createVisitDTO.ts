export class createVisitDTO {
  visitorId: string;
  visitor: {
    id: string;
    email: string;
    phone: string;
    createdAt: String;
    name: string;
    company?: string;
    visits: createVisitDTO[];
  };
  purpose: string;
  host: string;
  checkin: string;
  checkout: string | null;
}
