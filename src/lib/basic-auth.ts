export type BasicAuthEnvironment = {
  nodeEnv?: string;
  username?: string;
  password?: string;
};

export type BasicAuthCredentials = {
  username: string;
  password: string;
};

export function resolveBasicAuthCredentials({
  nodeEnv,
  username,
  password
}: BasicAuthEnvironment): BasicAuthCredentials | null {
  const isProduction = nodeEnv === "production";
  const hasUsername = Boolean(username?.trim());
  const hasPassword = Boolean(password);

  if (!isProduction && !hasUsername && !hasPassword) {
    return null;
  }

  if (!hasUsername || !hasPassword) {
    throw new Error(
      "APP_BASIC_AUTH_USER and APP_BASIC_AUTH_PASSWORD must both be configured."
    );
  }

  if (username?.includes(":")) {
    throw new Error("APP_BASIC_AUTH_USER cannot contain a colon.");
  }

  if ((password?.length ?? 0) < 12) {
    throw new Error(
      "APP_BASIC_AUTH_PASSWORD must contain at least 12 characters."
    );
  }

  return {
    username: username!.trim(),
    password: password!
  };
}

function constantTimeEqual(left: string, right: string) {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;

  for (let index = 0; index < length; index += 1) {
    difference |=
      (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return difference === 0;
}

export function isBasicAuthAuthorized(
  authorization: string | null,
  credentials: BasicAuthCredentials
) {
  if (!authorization?.toLowerCase().startsWith("basic ")) {
    return false;
  }

  try {
    const decoded = atob(authorization.slice(6).trim());
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex < 0) {
      return false;
    }

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    return (
      constantTimeEqual(username, credentials.username) &&
      constantTimeEqual(password, credentials.password)
    );
  } catch {
    return false;
  }
}
