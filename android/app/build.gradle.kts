import org.gradle.api.tasks.Exec
import org.gradle.api.tasks.Sync

plugins {
    alias(libs.plugins.android.application)
}

val webProjectDir = rootProject.projectDir.parentFile

val buildWebAssets by tasks.registering(Exec::class) {
    workingDir = webProjectDir
    commandLine("npm", "run", "build")
}

val syncWebAssets by tasks.registering(Sync::class) {
    dependsOn(buildWebAssets)
    from(webProjectDir.resolve("dist"))
    into(layout.projectDirectory.dir("src/main/assets"))
}

android {
    namespace = "com.juntack.mathcherrypractice"
    compileSdk {
        version = release(36) {
            minorApiLevel = 1
        }
    }

    defaultConfig {
        applicationId = "com.juntack.mathcherrypractice"
        minSdk = 23
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }
}

tasks.named("preBuild") {
    dependsOn(syncWebAssets)
}
