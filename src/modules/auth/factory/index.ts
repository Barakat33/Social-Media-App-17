import { SYS_ROLE, USER_AGENT } from "../../../utlis/common/enum";
import { generateHash } from "../../../utlis/hash";
import { generateExpiryDate, generateOTP } from "../../../utlis/OTP";
import { RegisterDTO } from "../auth.dto";
import { User } from "../../../DB/model/user/user.model";

export class AuthFactoryService {
  async createUser(registerDTO: RegisterDTO) {
    const hashedPassword = registerDTO.password
      ? await generateHash(registerDTO.password)
      : undefined;

    // لو fullName جاي، افصله
    let firstName = registerDTO.firstName;
    let lastName = registerDTO.lastName;

    if ((!firstName || !lastName) && registerDTO.fullName) {
      const [fName, ...rest] = registerDTO.fullName.split(" ");
      firstName = fName;
      lastName = rest.join(" ");
    }

    // 🟢 القيم الافتراضية لازم تبقى بالأرقام (مش strings)
    const user = new User({
      firstName,
      lastName,
      email: registerDTO.email,
      password: hashedPassword,
      phoneNumber: registerDTO.phoneNumber,
      gender: Number(registerDTO.gender) ?? 0,  // default male
      otp: generateOTP(),
      otpExpiry: generateExpiryDate(5 * 60 * 60 * 1000) as unknown as Date,
      credentialsUpdatedAt: new Date(),
      role: SYS_ROLE.user,            // 0
      userAgent: USER_AGENT.local,    // 0
      isVerified: false
    });

    await user.save();
    return user;
  }
}
