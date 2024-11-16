import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { db, SelectSkillsSet, skillsSet, players } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { playerId, skills }: { playerId: number; skills: SelectSkillsSet } =
      await req.json();

    // Check if the player already has skills saved
    const existingSkills = await db
      .select()
      .from(skillsSet)
      .where(eq(skillsSet.playerId, playerId))
      .limit(1);

    if (existingSkills.length > 0) {
      // Update existing skills
      await db
        .update(skillsSet)
        .set(skills)
        .where(eq(skillsSet.playerId, playerId));
    } else {
      // Insert new skills
      skills.playerId = playerId;
      await db.insert(skillsSet).values({ ...skills });
    }

    const player = await db
      .select()
      .from(players)
      .where(eq(players.id, playerId))
      .limit(1);

    if (player.length > 0) {
      player[0].configured = true;
      await db.update(players).set(player[0]).where(eq(players.id, playerId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving skills:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save skills' },
      { status: 500 }
    );
  }
}
