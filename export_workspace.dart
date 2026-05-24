import 'dart:io';

/// ===============================================================
/// Workspace Export Utility
/// ===============================================================
///
/// Features:
/// 1. Export COMPLETE workspace
/// 2. Export ONLY selected files/directories
/// 3. Ignore unwanted folders (.git, node_modules, build, etc.)
/// 4. Include source code only for configured extensions
/// 5. Show existence of binary/non-source files
///
/// ===============================================================
/// USAGE
/// ===============================================================
///
/// Export entire workspace:
///   dart run export_workspace.dart .
///
/// Export only selected files/folders:
///   dart run export_workspace.dart . css js index.html
///
/// Export another workspace:
///   dart run export_workspace.dart /my/project
///
/// Export selected files from another workspace:
///   dart run export_workspace.dart /my/project lib src/main.dart
///
/// ===============================================================
/// OUTPUT
/// ===============================================================
///
/// Generates:
///   workspace_dump.txt
///
/// Format:
///
/// ********** Start of css/style.css **********
/// body {
///   background: black;
/// }
/// ********** End of css/style.css **********
///
/// ===============================================================

/// File extensions whose CONTENT should be included.
///
/// Add any source code extension here.
final Set<String> includeContentExtensions = {
  '.html',
  '.css',
  '.js',

  // Common additional extensions
  '.dart',
  '.java',
  '.kt',
  '.py',
  '.ts',
  '.tsx',
  '.jsx',
  '.json',
  '.yaml',
  '.yml',
  '.xml',
  '.sql',
  '.sh',
  '.bat',
  '.md',
};

/// Directories to IGNORE completely.
///
/// These folders are usually huge and irrelevant
/// for AI code review/discussion.
final Set<String> ignoredDirectories = {
  '.git',
  '.github',
  '.idea',
  '.vscode',
  '.dart_tool',
  '.gradle',
  '.settings',

  'node_modules',
  'build',
  'dist',
  'target',
  'coverage',
  'out',
  'bin',

  // Flutter
  '.flutter-plugins',
  '.flutter-plugins-dependencies',
  '.pub-cache',

  // Android
  '.cxx',

  // macOS
  '.DS_Store',
};

/// Optional file extensions to skip completely.
///
/// Useful for avoiding huge binaries.
final Set<String> ignoredExtensions = {
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.mp4',
  '.mp3',
  '.zip',
  '.apk',
  '.exe',
  '.dll',
  '.class',
  '.jar',
};

const String outputFileName = 'workspace_dump.txt';

void main(List<String> args) async {
  if (args.isEmpty) {
    print('Usage:');
    print('  dart run export_workspace.dart <workspace> [paths...]');
    print('');
    print('Examples:');
    print('  dart run export_workspace.dart .');
    print('  dart run export_workspace.dart . css js index.html');
    exit(1);
  }

  final workspacePath = args[0];

  /// Optional selective paths
  ///
  /// Example:
  ///   css
  ///   js/app.js
  ///   src
  final selectivePaths = args.length > 1 ? args.sublist(1) : <String>[];

  final workspaceDir = Directory(workspacePath);

  if (!workspaceDir.existsSync()) {
    print('Workspace does not exist: $workspacePath');
    exit(1);
  }

  final outputFile = File(
    '${workspaceDir.path}${Platform.pathSeparator}$outputFileName',
  );

  final sink = outputFile.openWrite();

  sink.writeln('=================================================');
  sink.writeln('WORKSPACE EXPORT');
  sink.writeln('Generated on: ${DateTime.now()}');
  sink.writeln('Workspace: ${workspaceDir.absolute.path}');
  sink.writeln('=================================================');
  sink.writeln();

  if (selectivePaths.isEmpty) {
    // FULL workspace export
    await _processDirectory(workspaceDir, workspaceDir.path, sink);
  } else {
    // SELECTIVE export
    for (final relativePath in selectivePaths) {
      final fullPath =
          '${workspaceDir.path}${Platform.pathSeparator}$relativePath';

      final entityType = FileSystemEntity.typeSync(fullPath);

      if (entityType == FileSystemEntityType.notFound) {
        sink.writeln('########## NOT FOUND: $relativePath ##########');
        sink.writeln();
        continue;
      }

      if (entityType == FileSystemEntityType.directory) {
        await _processDirectory(Directory(fullPath), workspaceDir.path, sink);
      } else if (entityType == FileSystemEntityType.file) {
        await _processFile(File(fullPath), workspaceDir.path, sink);
      }
    }
  }

  await sink.flush();
  await sink.close();

  print('Done.');
  print('Output file: ${outputFile.path}');
}

Future<void> _processDirectory(
  Directory directory,
  String rootPath,
  IOSink sink,
) async {
  final entities = directory.listSync()
    ..sort((a, b) => a.path.compareTo(b.path));

  for (final entity in entities) {
    final name = entity.uri.pathSegments.isNotEmpty
        ? entity.uri.pathSegments.last.replaceAll('/', '')
        : entity.path;

    // Ignore unwanted directories
    if (entity is Directory && ignoredDirectories.contains(name)) {
      continue;
    }

    if (entity is Directory) {
      await _processDirectory(entity, rootPath, sink);
    } else if (entity is File) {
      await _processFile(entity, rootPath, sink);
    }
  }
}

Future<void> _processFile(File file, String rootPath, IOSink sink) async {
  try {
    final relativePath = _relativePath(file.path, rootPath);

    final extension = _getExtension(file.path).toLowerCase();

    // Skip unwanted file types entirely
    if (ignoredExtensions.contains(extension)) {
      return;
    }

    sink.writeln('********** Start of $relativePath **********');

    if (includeContentExtensions.contains(extension)) {
      try {
        final content = await file.readAsString();

        sink.writeln(content);
      } catch (e) {
        sink.writeln('[ERROR READING FILE CONTENT: $e]');
      }
    } else {
      sink.writeln('[File exists. Content intentionally skipped.]');
    }

    sink.writeln('********** End of $relativePath **********');

    sink.writeln();
    sink.writeln();
  } catch (e) {
    sink.writeln('[ERROR PROCESSING FILE: ${file.path}]');
    sink.writeln(e.toString());
    sink.writeln();
  }
}

String _relativePath(String fullPath, String rootPath) {
  var normalizedFull = fullPath.replaceAll('\\', '/');

  var normalizedRoot = rootPath.replaceAll('\\', '/');

  if (!normalizedRoot.endsWith('/')) {
    normalizedRoot += '/';
  }

  return normalizedFull.replaceFirst(normalizedRoot, '');
}

String _getExtension(String path) {
  final index = path.lastIndexOf('.');

  if (index == -1) {
    return '';
  }

  return path.substring(index);
}
