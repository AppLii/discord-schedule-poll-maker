export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-gray-200 text-center">
            このアプリケーションは
            <a
              href="https://github.com/AppLii/discord-schedule-poll-maker"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-200 transition-colors underline ml-1"
            >
              GitHubリポジトリ
            </a>
            から確認できます。
          </p>
          <p className="text-sm text-gray-200">
            Copyright ©AppLii, Wakayama Univ. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
