import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Player as PlayerModel } from '@/lib/models';
import { Eye } from 'lucide-react';
import Link from 'next/link';

export function Player({ player }: { player: PlayerModel }) {
  return (
    <TableRow>
      <TableCell className="font-medium w-[80%]">{player.name}</TableCell>
      <TableCell className="w-[15%]">
        <Badge variant="outline" className="capitalize">
          {player.configured ? 'configured' : 'not configured'}
        </Badge>
      </TableCell>
      <TableCell className="w-[5%]">
        <Button asChild size="sm" variant="ghost" className="w-full">
          <Link href={`/players/${player.id}`}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}
