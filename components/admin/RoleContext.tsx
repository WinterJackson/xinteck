"use client";

import { Role } from "@prisma/client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface RoleContextValue {
  userRole: Role;
  userId: string;
  userName: string;
  userAvatar?: string;
  setUserAvatar: (avatar: string) => void;
  setUserName: (name: string) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({
  children,
  userRole,
  userId,
  userName,
  userAvatar,
}: {
  children: ReactNode;
  userRole: Role;
  userId: string;
  userName: string;
  userAvatar?: string;
}) {
  const [name, setName] = useState(userName);
  const [avatar, setAvatar] = useState(userAvatar);

  // Sync with props if they change (e.g. server revalidation)
  useEffect(() => {
    setName(userName);
    setAvatar(userAvatar);
  }, [userName, userAvatar]);

  return (
    <RoleContext.Provider 
        value={{ 
            userRole, 
            userId, 
            userName: name, 
            userAvatar: avatar,
            setUserAvatar: setAvatar,
            setUserName: setName
        }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return ctx;
}
