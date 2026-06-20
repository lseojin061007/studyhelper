import Timer from "./components/Timer";
import RobotArea from "./components/RobotArea";
import { createClient } from "../lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full px-4 sm:px-6 py-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950">
      <div className="max-w-6xl w-full text-center space-y-10">
        
        {!user ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-4 border border-indigo-100 dark:border-indigo-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              새로운 학습 경험의 시작
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              당신의 완벽한{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                학습 파트너
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
              필요한 모든 도구가 한 곳에. 영어 사전부터 AI 어시스턴트까지, StudyHelper와 함께 스마트하게 학습하세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 items-center w-full max-w-5xl mx-auto">
            {/* Left: Timer */}
            <div className="flex justify-center animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
              <Timer />
            </div>

              <RobotArea />
          </div>
        )}
        
      </div>
    </div>
  );
}
