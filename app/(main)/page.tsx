import { cookies } from 'next/headers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EventDetails } from './home/event';
import { ParticipantsList } from './home/participants';
import { InteractiveButtons } from './home/interactive-buttons';
import PageError from './error';
import { getUpcomingEvent } from '@/lib/db';

export default async function Page() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('id')?.value
    ? Number(cookieStore.get('id')!.value)
    : null;
  const isConfigured = Boolean(cookieStore.get('configured')?.value);

  if (!userId || !isConfigured) {
    return <PageError error={Error('Player not found!')} />;
  }

  const upcomingEvent = await getUpcomingEvent();

  console.log(upcomingEvent?.participants.length);

  const isParticipating = upcomingEvent?.participants.some(
    (p) => p.playerId === userId && !p.withdrewAt
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center mb-4">
          <CardTitle>Upcoming Event</CardTitle>
          {upcomingEvent && (
            <InteractiveButtons
              eventId={upcomingEvent.id}
              currentUserId={userId}
              isParticipating={isParticipating ?? false}
              isConfigured={isConfigured}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <EventDetails event={upcomingEvent} />
          <ParticipantsList participants={upcomingEvent?.participants ?? null} />
        </div>
      </CardContent>
    </Card>
  );
}
