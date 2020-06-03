using System;
using System.Security.Cryptography;

namespace Slagkraft.Services
{
    public static class PasswordHasher
    {
        #region Public Methods

        /// <summary>
        /// Hashes and returns a password
        /// </summary>
        /// <param name="password">The Password you want hashed</param>
        /// <returns>This is "salt + hash"</returns>
        static public string GetHash(string password)
        {
            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);

            return Convert.ToBase64String(GetHash(password, salt));
        }

        /// <summary>
        /// Hashes and returns a password with the given salt
        /// </summary>
        /// <param name="password">The password you want hashed</param>
        /// <param name="salt">The salt you would like to use<para>Does accept already hashed passwords</para></param>
        /// <returns>String Salt[16]+hash[20]</returns>
        static public string GetHash(string password, string salt)
        {
            byte[] _salt;
            if (salt.Length != 16)
                salt = salt.Substring(0, 16);

            _salt = Convert.FromBase64String(salt);

            return Convert.ToBase64String(GetHash(password, _salt));
        }

        /// <summary>
        /// Verifies a password against a hash
        /// </summary>
        /// <param name="password">Your password attempt</param>
        /// <param name="hashed">The correct password in its hashed form</param>
        static public bool Verify(string password, string hashed)
        {
            byte[] hashedBytes = Convert.FromBase64String(hashed);

            byte[] salt = new byte[16];
            Array.Copy(hashedBytes, 0, salt, 0, 16);

            byte[] hashedPassword = GetHash(password, salt);

            //Change return true/false to codes for front end.
            for (int i = 16; i < 36; i++)
            {
                if (hashedBytes[i] != hashedPassword[i])
                    return false;
            }
            return true;
        }

        #endregion Public Methods

        #region Private Methods

        /// <summary>
        /// Private GetHash
        /// </summary>
        static private byte[] GetHash(string password, byte[] salt)
        {
            byte[] hash = new Rfc2898DeriveBytes(password, salt, 10000).GetBytes(20);

            byte[] hashPass = new byte[37];
            Array.Copy(salt, 0, hashPass, 0, 16);
            Array.Copy(hash, 0, hashPass, 16, 20);

            return hashPass;
        }

        #endregion Private Methods
    }
}