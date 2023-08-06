import { SignInButton, SignOutButton, SignUpButton, useUser, UserButton } from "@clerk/nextjs";

const AuthButtons = () => {
    const { user } = useUser();
    const redirectToSignIn = () => {
        window.location.reload()
    };
    if (user) {
        return (
            <div className="flex flex-row items-center gap-2">
                <UserButton />
                <SignOutButton />
            </div>
        );
    } else {
        return (
            <div className="flex flex-row items-center gap-4">
                <SignInButton />
                <SignUpButton />
            </div>
        );
    }
}
export default AuthButtons;