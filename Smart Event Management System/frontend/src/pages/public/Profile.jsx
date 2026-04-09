import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center text-gray-500 text-sm">
          You need to be logged in to view your profile.
        </div>
      </div>
    );
  }

  const avatarUrl =
    currentUser.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=E8441A&color=fff`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#E8441A]"
            />
            <div>
              <h1 className="text-xl font-bold text-[#1A1A2E]">{currentUser.name}</h1>
              <p className="text-sm text-gray-500 capitalize">{currentUser.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Email
              </p>
              <p className="text-sm text-[#1A1A2E]">{currentUser.email}</p>
            </div>

            {/* Placeholder for future profile settings */}
            <div className="mt-4 text-xs text-gray-400">
              Profile editing and preferences can be added here later.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
