import { useEffect } from "react";
import {
  UnauthenticatedTemplate,
  useMsal,
  useAccount,
} from "@azure/msal-react";
import { LockClosedIcon } from "@heroicons/react/20/solid";

import { classNames } from "../utils.js";
import { useStore } from "../store";

export default function SignedOut() {
  const setProfileImageURL = useStore((state) => state.setProfileImageURL);
  const setSelectedNameFilter = useStore(
    (state) => state.setSelectedNameFilter
  );

  const handleLogin = () => {
    instance.loginRedirect();
  };

  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});

  useEffect(() => {
    const callMsGraph = async (token) => {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      // Add additional fields here
      return fetch(`https://graph.microsoft.com/v1.0/me/photo/$value`, {
        method: "GET",
        headers,
      }).then(async (response) => {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setProfileImageURL(url);
      });
    };

    if (account && inProgress === "none") {
      instance
        .acquireTokenSilent({
          scopes: ["User.Read", "profile"],
          account: account,
        })
        .then((response) => {
          setSelectedNameFilter(response.account.name);
          callMsGraph(response.accessToken);
        });
    }
  }, [account, instance, inProgress, setProfileImageURL]);

  return (
    <UnauthenticatedTemplate>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <LockClosedIcon
            className="mx-auto mt-12 h-12 w-12 text-gray-400"
            aria-hidden="true"
          />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Login Required
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Profound Logic employees must login with their Microsoft account.
          </p>
          <div className="mt-6">
            <button
              className={classNames(
                "mx-2 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              )}
              onClick={() => handleLogin()}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </UnauthenticatedTemplate>
  );
}
