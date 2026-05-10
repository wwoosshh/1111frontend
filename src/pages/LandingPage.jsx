import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';

export default function LandingPage() {
  return (
    <PageShell>
      <div className="flex flex-col items-center gap-4 py-10">
        <p className="text-center text-base">친구들과<br />약속 잡을 때</p>
        <Link to="/room/new" className="mt-6 px-6 py-2 bg-brand text-white rounded-md">방 만들기</Link>
        <p className="text-xs mt-2 text-brand-ink/60">초대 링크가 있다면 링크로 입장하세요</p>
      </div>
    </PageShell>
  );
}
